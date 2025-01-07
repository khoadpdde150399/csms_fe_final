import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    quantityButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        minWidth: '120px'
    },
    icon: {
        cursor: 'pointer',
        padding: '0 10px'
    },
    quantity: {
        margin: '0 15px'
    }
};

const ProductQuantityInput = (props) => {
    const { quantity, setQuantity, max } = props;

    const handleIncrease = () => {
        if (quantity < max) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div style={styles.quantityButton}>
            <MinusOutlined style={styles.icon} onClick={handleDecrease} />
            <span style={styles.quantity}>{quantity}</span>
            <PlusOutlined style={styles.icon} onClick={handleIncrease} />
        </div>
    );
};

export default ProductQuantityInput;