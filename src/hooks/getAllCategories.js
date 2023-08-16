import axios from 'axios'
import { useEffect, useState } from 'react';

export const getAllCategories = () => {

    const [ categories, setCategories ] = useState(null)

    const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://app.freddo.com.mx/wp-json/wc/v3/products/categories?per_page=30',
    headers: { 
        'Authorization': 'Basic Z2Nvcm9uYWRvNTEwMDpNTkwyIFNTNWIgNmZQNyBJVGtHIER3M3kgTllrbw=='
    }
    };

    useEffect(() => {
        axios.request(config)
            .then((response) => {
                setCategories(response.data)
            })
            .catch((error) => {
            console.log(error);
            });
    }, [])

    const parentCategories = []

    // categories.map( (item, index) => {
    //     if ( item.parent === 0 ) {
    //         parentCategories.push(item)
    //     }
    // })

    // console.log(parentCategories)

    return categories
}