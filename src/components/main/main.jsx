import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from './nav';
import AboutUs from '../about-us/about-us';
import Catalog from '../catalog/catalog';
import Footer from '../footer/footer';
import Order from '../order/order';
import Home from '../home/home';
import { Container } from 'semantic-ui-react';

function Main (){

    return (
        <Container>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Nav />}>
                        <Route index element={<Home />} />
                        <Route path="/sobre-nosotros" element={<AboutUs />} />
                        <Route path="/catalogo" element={<Catalog />} />
                        <Route path="/pedidos" element={<Order />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Footer />
        </Container>
    );
}

export default Main;