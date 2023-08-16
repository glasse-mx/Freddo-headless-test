import './ProductArchiveCard.css'

export const ProductArchiveCard = ({ id, title, priceR, priceS, desc, image, onSale }) => {

    const formatoMoneda = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    }

    return (
        <div className="product__card">
            <div className="img-box">
                <img src={image && image} alt={`${title} image`} />
                {
                    onSale && (
                        <span> {(((parseInt(priceR) - parseInt(priceS)) * 100) / parseInt(priceR)).toFixed(0)}% de Descuento</span>
                    )
                }
            </div>
            <div className="card-info">
                <h3>{title}</h3>
                <p>{desc ? desc : 'En este recuadro se dibuja la descripcion corta si la tiene, este es un texto default'}</p>
                <div className="info-footer">
                    <p>MXN {formatoMoneda(parseInt(priceR))}</p>
                    <div className="ctas">
                        <a href="#">
                            <i className="fa-solid fa-cart-arrow-down"></i>
                        </a>
                        <a href="#">
                            <i className="fa-brands fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
