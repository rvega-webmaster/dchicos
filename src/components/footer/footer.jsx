import React from 'react';
import './footer.scss';

function Footer (){
    const year = new Date().getFullYear();

    return (
        <footer>
            <span className='vertical-horizontal-center'>&copy; {year} www.dchicos.com v.4.0 Todos los derechos reservados</span>
        </footer>
    );
}

export default Footer;