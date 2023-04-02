import { FaUserAlt, FaBook } from 'react-icons/fa';
import { BiRss } from 'react-icons/bi';
import { AiFillTag } from 'react-icons/ai';
import { BsEye, BsCartPlusFill } from 'react-icons/bs';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ACTION, GlobalContext } from '../../../../context/globalContext';
import _ from 'lodash';
import { useSessionStorage } from '../../../../hooks/useStorage';


const BookDetails = (props) => {
    const { stateGlobal, dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [bookDetails, setBookDetails] = useSessionStorage('bookDetails', stateGlobal.dataBookBorrowed);


    const handleAddCart = () => {
        if (_.isEmpty(stateGlobal.user))
            return navigate('/login');
        stateGlobal?.pushToCart(stateGlobal.dataBookBorrowed);
    }

    const handleCategory = (category) => {
        dispatch({
            type: ACTION.SET_DATA_FILTER_CONTENT_LIBRARY,
            payload: [{
                type: 'CATEGORY',
                categoryIds: [category.id],
                name: category.name,
            }]
        })
    }

    useEffect(() => {
        dispatch({ type: ACTION.SET_DATA_BOOK_BORROWED, payload: stateGlobal.dataBookBorrowed ?? bookDetails })
        setBookDetails(stateGlobal.dataBookBorrowed ?? bookDetails);
    }, [])

    function handleNotify() {

    }

    return (
        <>
            <div className='row'>
                <div className="col-3">
                    <img className='w-100 pt-3' src={stateGlobal.dataBookBorrowed?.image ?? stateGlobal.defaultImgUrl} alt="" />
                </div>
                <div className="col-9">
                    <h4>
                        {stateGlobal.dataBookBorrowed?.name}

                        {/* PDF */}
                        <a className='btn btn-outline-info float-end' href="https://drive.google.com/file/d/1RpgEQOAJl8fl4KINvgXIkwKhuTE363CJ/view?usp=share_link" target='_blank'>
                            PDF
                        </a>
                    </h4>
                    <p>[Cập nhật lúc: time]</p>
                    <div className="row">
                        <div className="col-6">
                            <p><FaBook /> Số lượng</p>
                            <p><FaUserAlt /> Tác giả</p>
                            <p><BiRss /> Tình trạng</p>
                            <p><AiFillTag /> Thể loại</p>
                            <p><BsEye /> Lượt mượn</p>
                        </div>
                        <div className="col-6">
                            <p className='fw-bold'>
                                {+stateGlobal.dataBookBorrowed?.quantityReality - +stateGlobal.dataBookBorrowed?.borrowed} cuốn
                            </p>
                            <p>Đang cập nhật</p>
                            <p>{stateGlobal.dataBookBorrowed?.Status?.name}</p>
                            <p>
                                {stateGlobal.dataBookBorrowed?.Categories?.length > 0 && stateGlobal.dataBookBorrowed?.Categories?.map((category, index) => {
                                    return (
                                        <Link to='/' key={`categoryDetails-${index}`} className='text-decoration-none'
                                            onClick={() => handleCategory(category)}
                                        >
                                            {`${category.name} ${index === stateGlobal.dataBookBorrowed?.Categories?.length - 1 ? '' : '-'} `}
                                        </Link>
                                    )
                                }, '')}
                            </p>
                            <p>69</p>
                        </div>
                    </div>

                    <div className="row">
                        <button disabled={+stateGlobal.dataBookBorrowed?.quantityReality - +stateGlobal.dataBookBorrowed?.borrowed <= 0} className='btn btn-success w-25 mb-2 me-3'
                            onClick={() => handleAddCart()}
                        >
                            <BsCartPlusFill size={24} /> Add cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookDetails;