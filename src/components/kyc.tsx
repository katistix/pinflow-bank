"use client"
import React, { useEffect } from 'react';
import { Onfido } from 'onfido-sdk-ui';


const OnfidoComponent = () => {
    const onfidoToken = process.env.NEXT_PUBLIC_ONFIDO_TOKEN;
    console.log('onfidoToken', onfidoToken);

    useEffect(() => {
        if (onfidoToken)
            Onfido.init({
                token: onfidoToken,
                containerId: "onfido-mount",
                steps: ["welcome", "document", "face", "complete"],
            });
    }, []);


    return <div id={"onfido-mount"} />;


};

export default OnfidoComponent;
