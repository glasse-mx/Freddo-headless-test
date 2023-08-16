// Import External dependencies
import { useEffect, useState } from "react"
import axios from 'axios'
import { Slider, Select, MenuItem } from "@mui/material"

// Import internal hooks and Functional components
import { getAllCategories } from "../hooks"
import { ProductArchiveCard } from "./ProductArchiveCard"
import LoadingComponent from "./LoadingComponent"
import ProductsPagination from "./ProductsPagination"
import { NotProductFound } from "./NotProductFound"

// Importing styles
import './ProductArchive.css'


export const ProductArchive = () => {

    const categories = getAllCategories()
    const [activeCategory, setActiveCategory] = useState()
    const [activePage, setActivePage] = useState(1)
    const [products, setProducts] = useState({})
    const [allPages, setAllPages] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isOnSale, setIsOnSale] = useState(false)
    const [priceRangeFilter, setPriceRangeFilter] = useState([0, 70000])
    const [orderBy, setOrderBy] = useState('default')

    const handleActiveCategory = (event) => {
        let newVal = event.target.value;
        setIsLoading(true)
        handleLoadProducts(newVal, 1, isOnSale, priceRangeFilter, orderBy)
    }

    const handleActiveDiscount = (event) => {
        let discount = event.target.value === 'onSaleOn' ? true : false
        setIsLoading(true)
        handleLoadProducts(activeCategory, activePage, discount, priceRangeFilter)

    }

    const handlePrinceRangefilter = (event, newValue) => {
        setPriceRangeFilter(newValue)
        setIsLoading(true)
        handleLoadProducts(activeCategory, activePage, isOnSale, newValue)
    }

    const handleSelectPage = (event) => {
        let newPage = event.target.value
        setIsLoading(true)
        handleLoadProducts(activeCategory, newPage, isOnSale, priceRangeFilter, orderBy)
    }

    const handleSelectOrder = (event) => {
        let order = event.target.value
        setIsLoading(true)
        handleLoadProducts(activeCategory, activePage, isOnSale, priceRangeFilter, order)
    }

    const handleFilterReset = () => {
        setIsLoading(true)
        handleLoadProducts()
    }

    const handleLoadProducts = async (activeCategory = 0, activePage = 1, isOnSale = false, filterPrice = [0, 70000], orderBy = 'default') => {

        let order = ''

        switch (orderBy) {
            case 'lowerPrice':
                order = `orderby=price&order=asc`
                break
            case 'higherPrice':
                order = `orderby=price&order=desc`
                break

            default:
                order = `order=asc`
        }

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://app.freddo.com.mx/wp-json/wc/v3/products?per_page=12&${order}${(activeCategory != 0) ? `&category=${activeCategory}` : ''}${activePage != 1 ? `&page=${activePage}` : ''}${isOnSale ? `&on_sale=${isOnSale}` : ''}${filterPrice ? `&min_price=${filterPrice[0]}&max_price=${filterPrice[1]}` : ''}`,
            headers: {
                'Authorization': 'Basic Z2Nvcm9uYWRvNTEwMDpNTkwyIFNTNWIgNmZQNyBJVGtHIER3M3kgTllrbw=='
            }
        }

        try {
            const response = await axios.request(config)
            setProducts(response.data)
            setAllPages(response.headers['x-wp-totalpages'])
            setIsLoading(false)
            setActiveCategory(activeCategory)
            setIsOnSale(isOnSale)
            setActivePage(activePage)
            setPriceRangeFilter(filterPrice)
            setOrderBy(orderBy)
            // console.log(activeCategory)
        } catch {
            console.error('Error de conexion')
        }

    }

    useEffect(() => {
        console.log('se monto')
        if (!activeCategory) {
            handleLoadProducts()
        }
    }, [])

    return (
        <div className="container">
            <div className="archive__container">
                <div className="sidebar">
                    <button
                        onClick={handleFilterReset}
                    >
                        Quitar todos los Filtros
                    </button>

                    {/* Ordenamiento */}

                    <Select
                        id="orderBy"
                        value={orderBy}
                        onChange={handleSelectOrder}
                    >
                        <MenuItem value={'default'}>Default</MenuItem>
                        <MenuItem value={'lowerPrice'}>Precio mas bajo</MenuItem>
                        <MenuItem value={'higherPrice'}>Precio mas alto</MenuItem>
                    </Select>

                    <h3>Categorias</h3>
                    <label>
                        <input
                            type="radio"
                            value={0}
                            onChange={handleActiveCategory}
                            checked={activeCategory == 0 ? true : false}
                        />
                        Todos los Productos
                    </label>
                    {
                        categories && categories.map((cat, index) => {
                            if (cat.parent == 0 && cat.slug != 'sin-categorizar') {
                                return (
                                    <label key={cat.id}>
                                        <input
                                            type="radio"
                                            name={cat.name}
                                            id={cat.id}
                                            value={cat.id}
                                            onChange={handleActiveCategory}
                                            checked={activeCategory == cat.id ? true : false}
                                        />
                                        {cat.name}
                                    </label>
                                )
                            }
                        })
                    }

                    <h3>Promociones</h3>
                    <label>
                        <input
                            type="radio"
                            name="Con descuento"
                            id="onSale"
                            value='onSaleOn'
                            onChange={handleActiveDiscount}
                            checked={isOnSale ? true : false}
                        />
                        Con descuento
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="Con descuento"
                            id="onSale"
                            value='onSaleOff'
                            onChange={handleActiveDiscount}
                            checked={!isOnSale ? true : false}
                        />
                        Sin descuento
                    </label>

                    <h3>Precio</h3>
                    <Slider
                        min={0}
                        max={70000}
                        value={priceRangeFilter}
                        valueLabelDisplay="on"
                        onChange={handlePrinceRangefilter}
                    // getAriaValueText={`MXN $${priceRangeFilter}`}
                    />

                </div>

                <div className="products__display">

                    <div className="display__header">
                        <h2>Tienda</h2>
                    </div>

                    <div className="products__container">
                        {
                            !isLoading ? (
                                products.length != 0 ? products.map(item => {
                                    return <ProductArchiveCard
                                        key={item.id}
                                        title={item.name}
                                        desc={item.short_description}
                                        image={item.images[0]?.src}
                                        priceR={item.regular_price}
                                        priceS={item.sale_price}
                                        onSale={item.on_sale}
                                    />
                                }) : <NotProductFound />
                            ) : <LoadingComponent />
                        }
                    </div>

                    <div className="products__pagination">
                        {
                            !isLoading
                                ? <ProductsPagination
                                    cant={allPages}
                                    activePage={activePage}
                                    action={handleSelectPage}
                                />
                                : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
