import PropTypes from 'prop-types';
import { LoadButton } from './Button.styled';

export const Button = ({ children, onClick }) => {
    return (
        <LoadButton type="button" onClick={onClick} aria-label="Load more">
            {children}
        </LoadButton>
    )
};

Button.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func.isRequired,
};