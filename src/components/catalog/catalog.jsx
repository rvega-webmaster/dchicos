import React, { useState, useEffect } from "react";
import { Container, Segment } from 'semantic-ui-react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { RequestBuilderService } from '../../services/request-builder-services';
import BouncingDotsLoader from "../bouncing-dots-loader/bouncing-dots-loader";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import './catalog.scss';

function Catalog (){
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [userLogin, setUserLogin] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);
    const [products, setProducts] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categorySelected, setCategorySelected] = useState(null);
    const [apiLoader, setApiLoader] = useState(false);

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

    const load = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if (token === process.env.REACT_APP_CATALOG_TOKEN) {
                setUserLogin(true);
                setInvalidToken(false);
            } else {
                setInvalidToken(true);
            }
            setLoading(false);
        }, 1000);
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

    return (
        <Container className="catalog">
            {
                userLogin ? 
                    <Segment className="t-align-center">
                        <h2 className="color-grey t-align-center mt-40 mb-40">Catalogo de Productos</h2>
                        <div>
                            <Dropdown value={categorySelected} onChange={(e) => changeCategory(e.value)} options={categoryOptions} optionLabel="description" placeholder="Categorias" loading={apiLoader}
                                filter valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} className={`w-full md:w-14rem ${apiLoader ? 'mb-50': products.length > 0 ? 'mb-50' : 'mb-100'}`} />
                            </div>
                        { apiLoader ? <div className="mb-50"><BouncingDotsLoader /> </div> 
                        : 
                            <>
                                { products.length > 0 ?
                                    products.map((product, index) => {
                                        return(
                                            <div className="product-container" key={index}>
                                                <img className="horizontal-space" src={`https://www.dchicos.com/${product.image}`} />
                                                <p className="horizontal-space t-align-center"><b>{product.productID}</b></p>
                                                <p className="horizontal-space t-align-center">{product.productName}</p>
                                                <div className="price-container mt-20">
                                                    <p className="catalog-price">&#x20a1;{numberWithCommas(parseInt(product.price))}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                : null }
                            </>
                        }
                    
                    </Segment>
                :
                    <Segment className="access-token-container t-align-center">
                        <h2 className="color-grey t-align-center mt-100">Acceso al Catalogo de Productos</h2>
                        <form onSubmit={load} className="mb-100">
                            <div className="token-field-container mt-30 mb-10">
                                <FloatLabel>
                                    <InputText id="token" value={token} onChange={(e) => setToken(e.target.value)} required/>
                                    <label htmlFor="token">Codigo de acceso</label>
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

export default Catalog;