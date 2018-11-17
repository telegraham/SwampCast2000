import React from 'react';
import { NavLink } from 'react-router-dom';

export default function(props) {
    const linx = props.locations.map(location => { return (<li key={ location.id }>
        <NavLink to={ "/" + location.name.toLowerCase() }>{ location.name }</NavLink>
      </li>)
    });

    return (<ol className="locations">
      { linx }
    </ol>)
}
