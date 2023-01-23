import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import _ from "lodash";
import useToggle from '../../hooks/useToggle';
import { useRef } from 'react';
import { sortList } from '../../utils/myUtils';


const Sorting = ({ listSort, setListSort, column }) => {
    const [sorting, toggleSorting] = useToggle(true);
    const listSortRef = useRef(listSort);

    function handleSorting() {
        let listSortClone = _.cloneDeep(listSort);

        if (document.querySelector(`.desc-${column}`)?.classList?.contains('opacity-100')) {
            toggleSorting();
            setListSort(listSortRef.current);
            return;
        }

        if (document.querySelector(`.asc-${column}`).classList.contains('opacity-100')) {
            listSortClone = sortList(listSortClone, column, 'DESC');
            document.querySelector(`.asc-${column}`).classList.remove('opacity-100');
            toggleSorting();
        } else {
            document.querySelector(`.asc-${column}`).classList.add('opacity-100');
            listSortClone = sortList(listSortClone, column);
        }

        setListSort(listSortClone);
    }

    return (
        <span className='float-end'>
            <span onClick={() => handleSorting()} >
                {sorting ?
                    <AiOutlineArrowUp className={`arrowUp asc-${column}`} size={24} opacity={0.5} />
                    :
                    <AiOutlineArrowDown className={`arrowDown desc-${column} opacity-100`} size={24} opacity={0.5} />
                }
            </span>
            <BsThreeDotsVertical className='threeDotsIcon' size={24} opacity={0.5} />
        </span>
    )
}

export default Sorting;