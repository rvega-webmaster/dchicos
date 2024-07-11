import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import banner1 from '../../resources/images/banner-1.png';
import banner2 from '../../resources/images/banner-2.png';
import banner3 from '../../resources/images/banner-3.jpg';
import banner4 from '../../resources/images/banner-4.jpg';
import banner5 from '../../resources/images/banner-5.jpg';
import banner6 from '../../resources/images/banner-6.png';
import { Container, Segment } from 'semantic-ui-react';
import './about-us.scss';

function AboutUs (){
    const [bannerList, setBannerList] = useState([]);
    const responsiveOptionsBanner = [
        {
            breakpoint: '1400px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        let initialBannerList = [
            {name: 'carousel banner', path: banner1},
            {name: 'carousel banner', path: banner2},
            {name: 'carousel banner', path: banner3},
            {name: 'carousel banner', path: banner4},
            {name: 'carousel banner', path: banner5},
            {name: 'carousel banner', path: banner6}
        ];
        setBannerList(initialBannerList);
    }, []);

    const imageTemplate = (image) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-3">
                    <img src={image.path} alt={image.name} className="w-6 shadow-2" />
                </div>
            </div>
        );
    };

    return (
        <Container className='about-us'>
            <Segment className='main-text d-inline-block'>
                <h2>Misión</h2>
                <p>Brindar los mejores productos para consentir a tu Bebé en los primeros momentos de su vida desde la comodidad de tu hogar.</p>
                
                <h2>Visión</h2>
                <p>Ser líderes en la distribución de productos con la más alta calidad y tecnología para tu Bebé. Nuestro compromiso es la satisfacion de nuestros clientes.</p>
                
                <h2>Valores</h2>
                <ul className='categories'>
                    <li>Satisfacion total.</li>
                    <li>Puntualidad en la entrega de tus productos.</li>
                    <li>Confianza.</li>
                </ul>
            </Segment>
            <Segment className='news-container d-inline-block'>
                <div className='news-box'>
                    <h2>Ultimas Noticias</h2>
                    <p>Conozca el Coche y Silla cargadora, visita nuestra galeria y conoce mas.</p>
                </div>
                <div className='news-box'>
                    <h2>Categorias</h2>
                    <ul>
                        <li>Coches para Bebe</li>
                        <li>Cunas</li>
                        <li>Encierros</li>
                        <li>Cadenitas</li>
                        <li>Moviles Musicales</li>
                        <li>Silla para Autos</li>
                    </ul>
                </div>
            </Segment>
            <div className="card banner">
                <Carousel value={bannerList} numVisible={1} numScroll={1} responsiveOptions={responsiveOptionsBanner} className="custom-carousel" circular
                autoplayInterval={1500} itemTemplate={imageTemplate} />
            </div>
        </Container>
    );
}

export default AboutUs;