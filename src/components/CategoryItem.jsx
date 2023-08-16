import React from 'react'

export const CategoryItem = ({ name, id, checked, value, onchecked }) => {
    return (
        <label>
            <input
                type="radio"
                name={name}
                id={id}
                value={id}
                onChange={handleActiveCategory}
                checked={activeCategory == cat.id ? true : false}
            />
            {cat.name}
        </label>

    )
}
