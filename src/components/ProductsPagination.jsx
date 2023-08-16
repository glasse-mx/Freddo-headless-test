import React from 'react'
import './ProductsPagination.css'

const ProductsPagination = ({ cant, activePage, action }) => {

    const pages = []

    for (let i = 1; i <= cant; i++) {
        pages.push(i)
    }


    return (
        <ul className='pagination__container'>
            {
                pages && pages.map(item => {
                    return (
                        <label key={item} className={`pageItem ${(activePage === item) && 'active-page'}`}>
                            <input
                                type="radio"
                                name={`page-${item}`}
                                id={`page-${item}`}
                                checked={(activePage == item) ? true : false}
                                value={item}
                                onChange={action}
                            />
                            {item}
                        </label>
                    )
                })
            }
        </ul>
    )
}

export default ProductsPagination