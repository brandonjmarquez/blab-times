import { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown';

const MenuItem = ({ items }: any) => {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLLIElement>();

  useEffect(() => {
    const clickHandler = (e: Event) => {
      if(dropdown && ref.current && !ref.current.contains(e.target)) {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", clickHandler)
    document.addEventListener("touchstart", clickHandler)

    return () => {
      document.removeEventListener("mousedown", clickHandler)
      document.removeEventListener("touchstart", clickHandler)
    }
  }, [dropdown]);

  return (
    <li ref={ref} className="relative">
      {items.submenu ? (
        <>
          <button 
            className="inline-flex items-center text-custom-200 bg-custom-300 hover:bg-green-300 p-3 mx-1 rounded-md"
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {items.title}{' '}
          </button>
          <Dropdown dropdown={dropdown} submenus={items.submenu} />
        </>
      ) : (
        <button onClick={() => items.target ? window.open(items.url) : location.href=items.url} className="text-custom-200 bg-custom-300 hover:bg-green-300 p-3 mx-1 rounded-md">{items.title}</button>
        // <button onClick={() => location.href=items.url} target={items.target ? items.target : "_self"} className="bg-custom-300 hover:bg-green-300 p-3 rounded-md">{items.title}</button>
      )}
    </li>
  )
}

export default MenuItem;