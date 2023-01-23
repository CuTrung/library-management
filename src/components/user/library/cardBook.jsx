import { Link, useNavigate } from "react-router-dom";
import "../../../assets/scss/user/library/cardBook.scss";
import { removeDiacritics } from "../../../utils/myUtils";


const CardBook = ({ imgName, book, rounded = false }) => {
    const navigate = useNavigate();


    return (
        <>
            <div className="itemBook col-3 position-relative mb-3">
                <button
                    className="btn p-0 w-100"
                    onClick={() => navigate(`details/${removeDiacritics(book.name.split(" ").join("-"), 'LOWER')}`, { state: { book } })}
                >
                    <img
                        className={`w-100 ${rounded ? 'rounded' : ''}`}
                        src={`../../../../src/assets/img/${imgName}`}
                        alt=""
                    />
                </button>

                <div className="w-75 h-25 bg-dark bg-opacity-75 text-white position-absolute bottom-0 start-50 translate-middle-x">
                    <p className="m-0 text-center">{book?.name}</p>
                    <p className="float-start">Mã sách: {book?.id}</p>
                    <p className="float-end">SL {book?.quantity} cuốn</p>
                </div>
            </div>
        </>
    );
};

export default CardBook;
