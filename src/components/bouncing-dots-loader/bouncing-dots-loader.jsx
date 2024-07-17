import React from "react";
import './bouncing-dots-loader.scss';
import { Container } from 'semantic-ui-react';

const BouncingDotsLoader = () => {
    return(
        <Container className="bouncing-loader">
            <div></div>
            <div></div>
            <div></div>
        </Container>
    );
}

export default BouncingDotsLoader;