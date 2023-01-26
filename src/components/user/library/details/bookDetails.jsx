import { FaUserAlt } from 'react-icons/fa';
import { BiRss } from 'react-icons/bi';
import { AiFillTag, AiOutlineHeart } from 'react-icons/ai';
import { BsEye } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';

const BookDetails = (props) => {
    const { state, pathname } = useLocation();

    const handleAddCart = () => {
        state?.pushToCart(state.book);
    }

    return (
        <>
            <div className='row'>
                <div className="col-3">
                    <img className='w-100 pt-3' src="../../../../src/assets/img/quiz3.jpg" alt="" />
                </div>
                <div className="col-9">
                    <h4>{state?.book?.name}</h4>
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
                            <p>{state?.book?.Status?.name}</p>
                            <p>
                                {state?.book?.Categories?.length > 0 && state?.book?.Categories?.map((category, index) => {
                                    return (
                                        <Link key={`categoryDetails-${index}`} className='text-decoration-none'>
                                            {`${category.name} ${index === state.book.Categories.length - 1 ? '' : '-'} `}
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