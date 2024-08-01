/**
 * Under construction
 */

"use client"
import React, { useEffect } from 'react';
import { Onfido } from 'onfido-sdk-ui';

const OnfidoComponent = () => {
    useEffect(() => {
        const initOnfido = async () => {
            const sdkToken = process.env.NEXT_PUBLIC_ONFIDO_TOKEN!

            Onfido.init({
                token: sdkToken,
                containerId: 'onfido-mount',
                onComplete: function (data: any) {
                    console.log('Everything is complete', data);
                },
                steps: [
                    'welcome',
                    {
                        type: 'document',
                        options: {
                            documentTypes: {
                                passport: true,
                                driving_licence: true,
                                national_identity_card: true,
                                residence_permit: true,
                            },
                        },
                    },
                    'face',
                    'complete',
                ],
            });
        };

        initOnfido();

        return () => {
        };
    }, []);


};

export default OnfidoComponent;
