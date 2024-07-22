import React, { useState, useEffect } from "react";
import { Container, Segment } from 'semantic-ui-react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { RequestBuilderService } from '../../services/request-builder-services';
import BouncingDotsLoader from "../bouncing-dots-loader/bouncing-dots-loader";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import './order.scss';

function Order (){
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [userLogin, setUserLogin] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);
    const [products, setProducts] = useState([]);
    const [productSelected, setProductSelected] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categorySelected, setCategorySelected] = useState(null);
    const [apiLoader, setApiLoader] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [isAgent, setIsAgent] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [visibleAddProduct, setVisibleAddProduct] = useState(false);

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

        const method = 'POST';
        let payload = token ;
        
        RequestBuilderService('/ws-access-token/', payload, method).then((response) => {
            if (response.apiData && response.apiData.data) {
                switch(response.apiData.data) {
                    case 'agent':
                        setIsAgent(true);
                        break;
                    case 'not-authorized':
                        setInvalidToken(true);
                        break;
                    default:
                        if (response.apiData.data.length > 0) setCustomer(response.apiData.data[0]);
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
                setProducts(response.apiData.data);
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

    const handleOpenAddProduct = (product) => {
        console.log(product);
        setProductSelected(product);
        setVisibleAddProduct(true);
    }

    return (
        <Container className="order p-relative">
            {
                customer ? 
                    <Segment className="t-align-center">
                        <Segment className="customer">
                            <p><span><b>Cliente:</b> {customer.merchantID} - {customer.merchantName}</span></p>
                        </Segment>
                        <div>
                            <Dropdown value={categorySelected} onChange={(e) => changeCategory(e.value)} options={categoryOptions} optionLabel="description" placeholder="Categorias" loading={apiLoader}
                                filter valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} className={`w-full md:w-14rem mt-50 ${apiLoader ? 'mb-50': products.length > 0 ? 'mb-50' : 'mb-200'}`} />
                            </div>
                        { apiLoader ? <div className="mb-50"><BouncingDotsLoader /> </div> 
                        : 
                            <>
                                { products.map((product, index) => {
                                    return(
                                        <div className="product-container" key={index} onClick={() => handleOpenAddProduct(product)}>
                                            <img className="horizontal-space" src={`https://www.dchicos.com/${product.image}`} />
                                            <p className="horizontal-space t-align-center"><b>{product.productID}</b></p>
                                            <p className="horizontal-space t-align-center">{product.productName}</p>
                                            <div className="price-container mt-20">
                                                <p className="catalog-price">&#x20a1;{numberWithCommas(parseInt(product.price))}</p>
                                            </div>
                                        </div>
                                    );
                                })}

                                <Dialog visible={visibleAddProduct} modal className="add-product" style={{ width: '22rem' }} onHide={() => {if (!visibleAddProduct) return; setVisibleAddProduct(false); }}>
                                    <div className="product-container">
                                        { productSelected ? <img className="horizontal-space" src={`https://www.dchicos.com/${productSelected.image}`} /> : null }
                                        { productSelected ? <p className="horizontal-space t-align-center"><b>{productSelected.productID}</b></p> : null }
                                        { productSelected ? <p className="horizontal-space t-align-center">{productSelected.productName}</p> : null }
                                        { productSelected ?  
                                            <div className="price-container mt-20">
                                                <p className="catalog-price">&#x20a1;{numberWithCommas(parseInt(productSelected.price))}</p>
                                            </div>
                                        : null }
                                    </div>
                                    <Button label="Cancelar" className="mr-20" icon="pi pi-check" onClick={() => setVisibleAddProduct(false)} />
                                    <Button label="Agregar" icon="pi pi-check" onClick={() => setVisibleAddProduct(false)} autoFocus />
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
                            <div className="card flex flex-wrap justify-content-center gap-3">
                                <Button label="Validar Codigo" icon="pi pi-check" loading={loading} type="submit" />
                            </div>
                            { invalidToken ? <Message className="mt-10" severity="error" text="Codigo invalido" /> : null }
                        </form>
                    </Segment>
            }
        </Container>
    );
}

export default Order;