import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import slide1 from '../../resources/images/slide1.jpg';
import slide2 from '../../resources/images/slide2.jpg';
import slide3 from '../../resources/images/slide3.jpg';
import banner1 from '../../resources/images/banner-1.png';
import banner2 from '../../resources/images/banner-2.png';
import banner3 from '../../resources/images/banner-3.jpg';
import banner4 from '../../resources/images/banner-4.jpg';
import banner5 from '../../resources/images/banner-5.jpg';
import banner6 from '../../resources/images/banner-6.png';
import bebe from '../../resources/images/bebe.jpg';
import bienvenido from '../../resources/images/bienvenido.gif';
import { Container, Segment } from 'semantic-ui-react';
import './home.scss';

function Home (){
    const [imageList, setImageList] = useState([]);
    const [bannerList, setBannerList] = useState([]);
    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 1,
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
    const responsiveOptionsBanner = [
        {
            breakpoint: '3000px',
            numVisible: 3,
            numScroll: 1
        },
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
        let initialImageList = [
            {name: 'carousel image', path: slide1},
            {name: 'carousel image', path: slide2},
            {name: 'carousel image', path: slide3}
        ];
        setImageList(initialImageList);

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
        <Container className='home'>
            <div className="card">
                <Carousel value={imageList} numVisible={1} numScroll={1} responsiveOptions={responsiveOptions} className="custom-carousel" circular
                autoplayInterval={3000} itemTemplate={imageTemplate} />
            </div>
            <Segment className='main-text d-inline-block'>
                <img src={bebe} alt='bebe image' className='left-image' />
                <img src={bienvenido} alt='bienvenido image'  className='welcome-image' />
                <p className='first-paragraph'>D’Chicos consciente de la importancia de la seguridad y comodidad para los bebés, ha desarrollado una amplia línea de productos especializados que cumplen con todas las exigencias del mercado tanto en calidad como en precio.</p>
                <p>D’Chicos presenta una amplia línea en sillas de carro, boosters, sillas de comer. Una extensa variedad de cunas, encierros simples y con móviles, donde el bebé tendrá los más tiernos sueños.</p>
                <p>Además contamos con la línea más completa en coches de todo tipo tanto sombrilla como de llanta grande, que se ajustan a todas las necesidades de los nuevos papás. Lo invitamos a conocer toda la línea D’Chicos y si tiene alguna consulta con gusto lo atenderemos.</p>
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

export default Home;