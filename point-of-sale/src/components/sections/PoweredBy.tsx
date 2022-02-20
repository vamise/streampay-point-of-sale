import React, { FC } from 'react';
import { FyfyPayLogo } from '../images/FyfyPayLogo';
import * as css from './PoweredBy.module.pcss';

export const PoweredBy: FC = () => {
    return (
        <div className={css.root}>
            Powered by <FyfyPayLogo />
        </div>
    );
};
