import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../assets/scss/user/library/cardBook.scss";
import { removeDiacritics } from "../../../utils/myUtils";
import { useContext } from "react";
import { ACTION, GlobalContext } from "../../../context/globalContext";

const CardBook = ({ book, rounded = false, disabled, contentInline = false }) => {
    const navigate = useNavigate();

    const { stateGlobal, dispatch } = useContext(GlobalContext);

    function handleClickBook() {
        dispatch({ type: ACTION.SET_DATA_BOOK_BORROWED, payload: book })
        if (!contentInline)
            navigate(`details/${removeDiacritics(book.name.split(" ").join("-"), 'LOWER')}`);
    }

    return (
        <div className={`${contentInline ? 'itemBook row' : 'itemBook col-6 col-md-3 position-relative mb-3'}`}>
            <button
                disabled={disabled}
                className={`btn p-0 border-0 ${contentInline ? 'col-4' : 'w-100'}`}
                onClick={() => handleClickBook()}
            >
                {disabled ?
                    <span className="badge rounded-pill bg-danger float-end">Đã hết</span>
                    :
                    <span className={`badge rounded-pill bg-danger float-end text-white bg-white ${contentInline ? 'd-none' : ''}`}>Lấp layout</span>
                }

                <img
                    className={`w-100 ${rounded ? 'rounded' : ''}`}
                    src={book?.image ?? stateGlobal.defaultImgUrl}
                    alt=""
                />
            </button>

            {contentInline ?
                <div onClick={() => handleClickBook()} className="col-8 d-flex flex-column gap-1">
                    <p className="m-0 fw-bold">{book?.name}</p>
                    <p className="m-0">Mã sách: {book?.id}</p>
                    <p className="m-0">Có {+book?.quantityReality - +book?.borrowed} cuốn</p>
                    <p className="m-0">Lượt mượn: 999</p>
                </div>
                :
                <div className="w-75 h-25 bg-dark bg-opacity-75 text-white position-absolute bottom-0 start-50 translate-middle-x">
                    <p className="m-0 text-center">{book?.name}</p>
                    <p className="float-start">Mã sách: {book?.id}</p>
                    <p className="float-end">Có {+book?.quantityReality - +book?.borrowed} cuốn</p>
                </div>
            }
        </div>
    );
};

export default CardBook;
