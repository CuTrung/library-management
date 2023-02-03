import { FaUserAlt } from 'react-icons/fa';
import { BiRss } from 'react-icons/bi';
import { AiFillTag, AiOutlineHeart } from 'react-icons/ai';
import { BsEye } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ACTION, GlobalContext } from '../../../../context/globalContext';
import _ from 'lodash';

const BookDetails = (props) => {
    const { stateGlobal, dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleAddCart = () => {
        if (_.isEmpty(stateGlobal.user))
            return navigate('/login');
        stateGlobal?.pushToCart(stateGlobal.dataBookBorrowed);
    }

    const handleCategory = (category) => {
        dispatch({
            type: ACTION.SET_CATEGORY_IDS_CONTENT_LIBRARY,
            payload: {
                categoryIds: category.id,
                categoryNames: category.name
            }
        })
    }

    return (
        <>
            <div className='row'>
                <div className="col-3">
                    <img className='w-100 pt-3' src={stateGlobal.dataBookBorrowed.image ?? "../../../../src/assets/img/default.jpg"} alt="" />
                </div>
                <div className="col-9">
                    <h4>{stateGlobal.dataBookBorrowed.name}</h4>
                    <p>[Cập nhật lúc: time]</p>
                    <div className="row">
                        <div className="col-6">
                            <p><FaUserAlt /> Tác giả</p>
                            <p><BiRss /> Tình trạng</p>
                            <p><AiFillTag /> Thể loại</p>
                            <p><BsEye /> Lượt mượn</p>
                        </div>
                        <div className="col-6">
                            <p>Đang cập nhật</p>
                            <p>{stateGlobal.dataBookBorrowed.Status?.name}</p>
                            <p>
                                {stateGlobal.dataBookBorrowed.Categories?.length > 0 && stateGlobal.dataBookBorrowed.Categories?.map((category, index) => {
                                    return (
                                        <Link to='/' key={`categoryDetails-${index}`} className='text-decoration-none'
                                            onClick={() => handleCategory(category)}
                                        >
                                            {`${category.name} ${index === stateGlobal.dataBookBorrowed.Categories.length - 1 ? '' : '-'} `}
                                        </Link>
                                    )
                                }, '')}
                            </p>
                            <p>69</p>
                        </div>
                    </div>

                    <div className="row">
                        <button className='btn btn-success w-25 me-2 mb-2'><AiOutlineHeart size={24} /> Theo dõi</button>
                        <p className='w-50 pt-1'>
                            <strong>356</strong> Lượt theo dõi
                        </p>
                        <button className='btn btn-danger w-25'
                            onClick={() => handleAddCart()}
                        >Thêm vào</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookDetails;