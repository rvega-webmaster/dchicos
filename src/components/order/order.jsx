import React, { useState, useEffect } from "react";
import { Container, Segment } from 'semantic-ui-react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { RequestBuilderService } from '../../services/request-builder-services';
import BouncingDotsLoader from "../bouncing-dots-loader/bouncing-dots-loader";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import './order.scss';

function Order (){
    const [token, setToken] = useState('');
    const [agentCode, setAgentCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastOrderGetAllLoading, setLastOrderGetAllLoading] = useState(false);
    const [insertOrderLoading, setInsertOrderLoading] = useState(false);
    const [userLogin, setUserLogin] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);
    const [invalidAgentCode, setInvalidAgentCode] = useState(false);
    const [products, setProducts] = useState([]);
    const [productSelected, setProductSelected] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categorySelected, setCategorySelected] = useState(null);
    const [apiLoader, setApiLoader] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [agent, setAgent] = useState(null);
    const [isAgent, setIsAgent] = useState(false);
    const [agentCheck, setAgentCheck] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addProductVisible, setAddProductVisible] = useState(false);
    const [addProductAmount, setAddProductAmount] = useState('');
    const [addProductMessage, setAddProductMessage] = useState('');
    const [orderList, setOrderList] = useState([]);
    const [cart, setCart] = useState(null);
    const [subTotal, setSubTotal] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [iva, setIva] = useState(null);
    const [total, setTotal] = useState(null);
    const [cartVisible, setCartVisible] = useState(false);
    const [sendEmailToCustomer, setSendEmailToCustomer] = useState(false);
    const [cartNote, setCartNote] = useState('');
    let nextOrderDetailId = null;

    useEffect (() => {
        onGetCategories();
    }, []);

    const onGetCategories = () => {
        const method = 'GET';
        let payload = {};
        
        RequestBuilderService('/ws-get-categories/', payload, method).then((response) => {
            if (response.apiData && response.apiData.data) {
                setCategoryOptions(response.apiData.data);
            }

            if (response.apiError) {
                if (response.apiError.code === 'ECONNABORTED') {
                    console.log('New request has been executed.');
                    onGetCategories();
                }
                console.log('api error', response.apiError);
            }
        });
    } 

    const validateAccessToken = (e = undefined) => {
        if (e) e.preventDefault();
        setLoading(true);
        setInvalidToken(false);
        setInvalidAgentCode(false);

        const method = 'POST';
        let payload = {"token":token, "agentCode": agentCode} ;
        
        RequestBuilderService('/ws-access-token/', payload, method).then((response) => {
            if (response.apiData && response.apiData.data) {
                switch(response.apiData.data) {
                    case 'client-not-authorized':
                        setInvalidToken(true);
                        break;
                    case 'agent-not-authorized':
                        setInvalidAgentCode(true);
                        break;
                    default:
                        if (response?.apiData?.data?.client?.length > 0) setCustomer(response.apiData.data.client[0]);
                        if (response?.apiData?.data?.agent?.length > 0) setAgent(response.apiData.data.agent[0]);
                  }
                setLoading(false);
            }

            if (response.apiError) {
                if (response.apiError.code === 'ECONNABORTED') {
                    console.log('New request has been executed.');
                    validateAccessToken();
                } else {
                    console.log('api error', response.apiError);
                    setLoading(false);
                }
            }
        });
    };

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.description}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.description}</div>
            </div>
        );
    };

    const changeCategory = (category) => {
        setApiLoader(true);
        const method = 'POST';
        let payload = category.description;

        RequestBuilderService('/ws-get-products-filtered/', payload, method).then((response) => {
            
            if (response.apiData && response.apiData.data) {

                if (cart && cart.orderList.length > 0){
                    cart.orderList.forEach((product) => {
                        response.apiData.data.forEach((responseProduct, index) => {
                            if (product.id === responseProduct.productID){
                                response.apiData.data[index]['added'] = true;
                            } 
                        });
                    });
                    setProducts(response.apiData.data);
                } else {
                    setProducts(response.apiData.data);
                }
    
                setCategorySelected(category);
                setApiLoader(response.apiLoader);
            } 

            if (response.apiError) {
                if (response.apiError.code === 'ECONNABORTED') {
                    console.log('New request has been executed.');
                    changeCategory(category);
                } else {
                    console.log('api error', response.apiError);
                    setApiLoader(response.apiLoader);
                }
            }
            
        });
    }

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const handleOpenAddProduct = (product, index) => {
        if (product.added !== true){
            let tempProductSelected = product;
            tempProductSelected['index'] = index;
            setProductSelected(tempProductSelected);
            setAddProductVisible(true);
        }
    }

    const cancelAddProduct = () => {
        setAddProductVisible(false);
        setAddProductAmount('');
        setAddProductMessage('');
    }

    const insertProductLastOrder = () => {
        try{
            const method = 'POST';
            let payload = {};
            payload['product'] = productSelected;
            payload['customer'] = customer;
            payload['amount'] = addProductAmount;
            payload['message'] = addProductMessage;

            RequestBuilderService('/ws-last-order-insert/', payload, method).then((response) => { 
                if (response.apiError) {
                    if (response.apiError.code === 'ECONNABORTED') {
                        console.log('New request has been executed.');
                        insertProductLastOrder();
                    } else {
                        console.log('api error', response.apiError);
                    }
                }           
            });
        } catch (e) {
            console.log('Error Updating Last Product Insert', e);
        }
    }

    const addProduct = (e) => {
        try{
            if (e) e.preventDefault();

            let tempOrderList = [];
            if (cart && cart.orderList.length > 0) tempOrderList = cart.orderList;
            tempOrderList.push({id: productSelected.productID, name: productSelected.productName, amount: addProductAmount, message: addProductMessage, price: productSelected.price, index: productSelected.index});
            setOrderList(tempOrderList);
            setAddProductVisible(false);
            setAddProductAmount('');
            setAddProductMessage('');
            updateCart(tempOrderList);

            products.forEach((product) => {
                if (product.productID === productSelected.productID) product.added = true;
            });

            insertProductLastOrder();

        } catch (e) {
            console.log('Error Updating Cart', e);
        }
    }

    const updateCart = (incomingOrderList) => {
        try{
            let tempSubTotal = 0;
            let tempDiscount = 0;
            let tempIva = 0;
            let tempTotal = 0;
            let tempOrderList = [];
            let tempCart = {};
            let percentageDiscount = 0;
            let totalDiscount = 0;

            incomingOrderList.forEach((order) => {
                let priceFormat = parseInt(order.price.replace(/,/g, ""));
                let amountFormat = parseInt(order.amount.replace(/,/g, ""));
                let singleProductSubTotal = priceFormat * amountFormat;

                tempOrderList.push(
                    {
                    index: order.index,
                    id: order.id, 
                    name: order.name, 
                    amount: order.amount, 
                    message: order.message, 
                    price: numberWithCommas(parseInt(order.price)),
                    singleProductSubTotal: numberWithCommas(parseInt(singleProductSubTotal))
                    }
                );

                tempSubTotal += singleProductSubTotal;
            });

            if (parseInt(customer.discount) > 0) {
                percentageDiscount = parseInt(customer.discount) / 100;
                tempDiscount = tempSubTotal * percentageDiscount;
                setDiscount(Math.ceil(tempDiscount));

                setSubTotal(Math.ceil(tempSubTotal));

                tempIva = Math.ceil((tempSubTotal - tempDiscount) * 0.13);
                setIva(Math.ceil(tempIva));

                tempTotal = (tempSubTotal - tempDiscount) + tempIva;
                setTotal(Math.ceil(tempTotal));

            } else {
                setSubTotal(Math.ceil(tempSubTotal));

                tempIva = Math.ceil(tempSubTotal * 0.13);
                setIva(tempIva);

                tempTotal = tempSubTotal + tempIva;
                setTotal(Math.ceil(tempTotal));
            }

            tempCart['orderList'] = tempOrderList;
            tempCart['subTotal'] = numberWithCommas(parseInt(tempSubTotal));
            tempCart['discount'] = numberWithCommas(parseInt(tempDiscount));
            tempCart['iva'] = numberWithCommas(parseInt(tempIva));
            tempCart['total'] = numberWithCommas(parseInt(tempTotal));
            setCart(tempCart);

        } catch (e) {
            console.log('Error Updating Cart', e);
        }
    }

    const cartHeader = () => {
        return(
            <Segment className="customer">
                <p><span><b>{customer.merchantID} - {customer.merchantName}</b></span></p>
                <p className="address">{customer.address}</p>
            </Segment>
        );
    }

    const getAllFromLastOrder = () => {
        try{
            setLastOrderGetAllLoading(true);
            const method = 'POST';
            let payload = {};
            payload['customer'] = customer.merchantID;

            RequestBuilderService('/ws-last-order-get-all/', payload, method).then((response) => { 
                if (response.apiData) {
                    if (response.apiData.data.length > 0) {
                        let tempOrderList = [];
                        response.apiData.data.forEach((product) => {
                            tempOrderList.push({
                                'amount': product.amount,
                                'id': product.product_id,
                                'message': product.comment,
                                'name': product.description,
                                'price': product.price,
                                'singleProductSubtotal': product.subtotal
                            });
                        });
                        updateCart(tempOrderList);
                    }
                    setLastOrderGetAllLoading(false);
                }

                if (response.apiError) {
                    if (response.apiError.code === 'ECONNABORTED') {
                        console.log('New request has been executed.');
                        getAllFromLastOrder();
                    } else {
                        console.log('api error', response.apiError);
                        setLastOrderGetAllLoading(false);
                    }
                }           
            });
        } catch (e) {
            console.log('Error Updating Last Product Insert', e);
        }
    }

    const insertOrder = () => {
        try{
            setInsertOrderLoading(true);
            getOrderDetailId();
        } catch (e) {
            console.log('Error Insert Order', e);
        }
    }

    const getOrderDetailId = () => {
        try{
            const method = 'GET';
            let payload = {};

            RequestBuilderService('/ws-get-latest-order-details-id/', payload, method).then((response) => { 
                if (response.apiData && response.apiData.data && response.apiData.data.length > 0) {
                    nextOrderDetailId = parseInt(response.apiData.data[0].ID) + 1;
                    insertOrderDetails();
                }

                if (response.apiError) {
                    if (response.apiError.code === 'ECONNABORTED') {
                        console.log('New request has been executed.');
                        getOrderDetailId();
                    } else {
                        console.log('api error', response.apiError);
                        setInsertOrderLoading(false);
                    }
                }           
            });
        } catch (e) {
            console.log('Error Insert Order Details', e);
        }
    }

    const insertOrderDetails = () => {
        try{
            const method = 'PUT';
            let payload = {};
            let orderListFormat = [];
            payload['nextOrderDetailId'] = nextOrderDetailId;

            cart.orderList.forEach((order) => {
                orderListFormat.push({
                    amount: parseInt(order.amount.replace(/,/g, "")),
                    price: parseInt(order.price.replace(/,/g, "")),
                    singleProductSubTotal: parseInt(order.singleProductSubTotal.replace(/,/g, "")),
                    id: order.id,
                    message: order.message,
                    name: order.name
                });
            });

            payload['orderDetails'] = orderListFormat;

            RequestBuilderService('/ws-insert-order-details/', payload, method).then((response) => { 
                if (response.apiData) {
                    insertOrderHead();
                }

                if (response.apiError) {
                    if (response.apiError.code === 'ECONNABORTED') {
                        console.log('New request has been executed.');
                        insertOrderDetails();
                    } else {
                        console.log('api error', response.apiError);
                        setInsertOrderLoading(false);
                    }
                }           
            });
        } catch (e) {
            console.log('Error Insert Order Details', e);
        }
    }

    const insertOrderHead = () => {
        try{
            const method = 'POST';
            let payload = {};
            payload['merchantID'] = customer.merchantID;
            payload['orderDetailtID'] = nextOrderDetailId;
            payload['discount'] = discount;
            payload['iva'] = iva;
            payload['total'] = total;
            payload['note'] = cartNote;
            payload['phone'] = phoneNumber;
            payload['submitted_by_id'] = "201rv";
            payload['submitted_by_name'] = "Ronny";
            payload['submitted_by_device'] = "MacBookPro";

            RequestBuilderService('/ws-insert-order-head/', payload, method).then((response) => { 
                if (response.apiData) {
                    if (response.apiData.data.length > 0) {
                        
                    }
                    setInsertOrderLoading(false);
                }

                if (response.apiError) {
                    if (response.apiError.code === 'ECONNABORTED') {
                        console.log('New request has been executed.');
                        insertOrderHead();
                    } else {
                        console.log('api error', response.apiError);
                        setInsertOrderLoading(false);
                    }
                }           
            });
        } catch (e) {
            console.log('Error Insert Order Head', e);
        }
    }

    return (
        <Container className="order p-relative">
            {
                customer ? 
                    <Segment className="t-align-center">
                        <Segment className="cart-container">
                            <Button label="Pedido" icon="pi pi-shopping-cart" className="cart-icon" onClick={() => setCartVisible(true)}/>
                            <Dialog visible={cartVisible} header={cartHeader} style={{ width: '1000px' }} onHide={() => {if (!cartVisible) return; setCartVisible(false); }}>
                                
                                { cart && cart.orderList ?
                                    <>
                                        <DataTable value={cart.orderList}>
                                            <Column field="id" header="Codigo"></Column>
                                            <Column field="name" header="Descripcion"></Column>
                                            <Column field="message" header="Comentario"></Column>
                                            <Column field="amount" header="Cantidad"></Column>
                                            <Column field="price" header="Precio"></Column>
                                            <Column field="singleProductSubTotal" header="SubTotal"></Column>
                                        </DataTable>

                                        <Segment className="total-container">
                                            <div>
                                                <label>SubTotal</label>
                                                <span className="cart-subtotal">{cart.subTotal}</span>
                                            </div> 
                                            <div>
                                                <label className="discount">Descuento {customer.discount}%</label>
                                                <span className="cart-discount">{cart.discount}</span>
                                            </div>
                                            <div>
                                                <label>IVA</label>
                                                <span className="cart-iva">{cart.iva}</span>
                                            </div>
                                            <div>
                                                <label>Total</label>
                                                <span className="cart-total">{cart.total}</span>
                                            </div>
                                        </Segment>

                                        <Segment className="order-recovery-container">
                                            <Button label="Retomar Pedido" icon="pi pi-sync" onClick={getAllFromLastOrder} loading={lastOrderGetAllLoading} disabled={insertOrderLoading}/>
                                        </Segment>
                                        
                                        <Segment className="send-email-to-customer-container">
                                            <Checkbox inputId="sendEmailToCustomer" name="sendEmailToCustomer" onChange={e => setSendEmailToCustomer(e.checked)} checked={sendEmailToCustomer} />
                                            <label htmlFor="sendEmailToCustomer" className="ml-2">Enviar correo al cliente</label>
                                        </Segment>

                                        <Segment className="cart-note-container">
                                            <label htmlFor="cart-note">Nota</label>
                                            <InputTextarea id="cart-note" value={cartNote} onChange={(e) => setCartNote(e.target.value)} rows={3} cols={50} />
                                        </Segment>

                                        <Segment className="send-order-container">
                                            <Button label="Enviar Pedido" icon="pi pi-shopping-cart" onClick={insertOrder} loading={insertOrderLoading} disabled={lastOrderGetAllLoading}/>
                                        </Segment>
                                    </>
                                :
                                    <>
                                        <p>Aun no ha agregado productos.</p>
                                        <Segment className="no-records-order-recovery-container">
                                            <Button label="Retomar Pedido" icon="pi pi-sync" onClick={getAllFromLastOrder} loading={lastOrderGetAllLoading}/>
                                        </Segment>
                                    </>
                                }

                            </Dialog>
                        </Segment>
                        <Segment className="customer">
                            <p><span><b>{customer.merchantID} - {customer.merchantName}</b></span></p>
                            <p className="address">{customer.address}</p>
                        </Segment>
                        <Segment>
                            <Dropdown value={categorySelected} onChange={(e) => changeCategory(e.value)} options={categoryOptions} optionLabel="description" placeholder="Categorias" loading={apiLoader}
                                filter valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} className={`w-full md:w-14rem mt-80 ${apiLoader ? 'mb-50': products.length > 0 ? 'mb-50' : 'mb-200'}`} />
                        </Segment>
                        { apiLoader ? <div className="mb-50"><BouncingDotsLoader /> </div> 
                        : 
                            <>
                                { products.map((product, index) => {
                                    return(
                                        <Segment className="single-product p-relative" key={index}>
                                            <div className={`product-container ${product.added ? 'added' : 'no-added'}`} onClick={() => handleOpenAddProduct(product,index)}>
                                                <img className="horizontal-space" src={`https://www.dchicos.com/${product.image}`} />
                                                <p className="horizontal-space t-align-center"><b>{product.productID}</b></p>
                                                <p className="horizontal-space t-align-center">{product.productName}</p>
                                                <div className="price-container mt-20">
                                                    <p className="catalog-price">&#x20a1;{numberWithCommas(parseInt(product.price))}</p>
                                                </div>
                                            </div>
                                            { product.added ?
                                                <div className="product-added-container">
                                                    <p>Agregado</p>
                                                </div>
                                            : null }
                                        </Segment>
                                    );
                                })}

                                <Dialog visible={addProductVisible} modal className="add-product" style={{ width: '22rem' }} onHide={() => {if (!addProductVisible) return; setAddProductVisible(false); }}>
                                    <Segment className="product-container t-align-center">
                                        { productSelected ? <img className="horizontal-space" src={`https://www.dchicos.com/${productSelected.image}`} /> : null }
                                        { productSelected ? <p className="horizontal-space"><b>{productSelected.productID}</b></p> : null }
                                        { productSelected ? <p className="horizontal-space">{productSelected.productName}</p> : null }
                                        { productSelected ?  
                                            <div className="price-container mt-20">
                                                <p className="catalog-price">&#x20a1;{numberWithCommas(parseInt(productSelected.price))}</p>
                                            </div>
                                        : null }
                                    </Segment>
                                    <form onSubmit={addProduct}>
                                        <Segment className="t-align-center">
                                            <InputText className="mb-10" keyfilter="int" placeholder="Cantidad" value={addProductAmount} onChange={(e) => setAddProductAmount(e.target.value)} required/>
                                            <InputText className="mb-10" placeholder="Comentario" value={addProductMessage} onChange={(e) => setAddProductMessage(e.target.value)} />
                                        </Segment>
                                        <Segment className="t-align-center">
                                            <Button label="Cancelar" className="mr-20" icon="pi pi-check" onClick={() => cancelAddProduct()} />
                                            <Button label="Agregar" icon="pi pi-check" type="submit" autoFocus />
                                        </Segment>
                                    </form>
                                </Dialog>
                            </>
                        }
                    
                    </Segment>
                :
                    <Segment className="access-token-container t-align-center">
                        <h2 className="color-grey t-align-center mt-100">Plataforma de Pedidos</h2>
                        <form onSubmit={validateAccessToken} className="mb-100">
                            <div className="token-field-container mt-30 mb-10">
                                <FloatLabel>
                                    <InputText id="token" value={token} onChange={(e) => setToken(e.target.value)} required invalid={invalidToken}/>
                                    <label htmlFor="token">Codigo de acceso</label>
                                </FloatLabel>
                            </div>
                            <div className="phone-field-container mt-30 mb-20">
                                <FloatLabel>
                                    <InputText id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}  keyfilter="int" required/>
                                    <label htmlFor="phone">Telefono</label>
                                </FloatLabel>
                            </div>
                            <div className="agent-field-container mt-20 mb-20">
                                <Checkbox inputId="agent-check" onChange={e => setAgentCheck(e.checked)} checked={agentCheck}></Checkbox>
                                <label htmlFor="agent-check" className="ml-10">Agente</label>
                                { agentCheck ? <InputText id="agent-check" className="mt-10" value={agentCode} onChange={(e) => setAgentCode(e.target.value)} required invalid={invalidAgentCode}/> : null }
                            </div>
                            <div className="card flex flex-wrap justify-content-center gap-3">
                                <Button label="Validar Codigo" icon="pi pi-check" loading={loading} type="submit" />
                            </div>
                            { invalidToken ? <Message className="mt-10" severity="error" text="Codigo invalido" /> : null }
                            { invalidAgentCode ? <Message className="mt-10" severity="error" text="Agente invalido" /> : null }
                        </form>
                    </Segment>
            }
        </Container>
    );
}

export default Order;