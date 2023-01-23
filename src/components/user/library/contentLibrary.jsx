import CardBook from "./cardBook";

const ContentLibrary = ({ listBooks, categoryName }) => {

    return (
        <>
            <div className="row">
                <div className="col-9 border border-3 row">
                    <h4 className="text-info">{categoryName ? `Thể loại: ${categoryName}` : 'Sách mới cập nhật'} &gt;</h4>
                    {listBooks.length > 0 &&
                        listBooks.map((book, index) => {
                            return (
                                <CardBook key={`book-${index}`} rounded={true} book={book} imgName={'quiz3.jpg'} />
                            )
                        })
                    }

                </div>
                <div className="col-3 border border-3">
                    history
                </div>
            </div>
        </>
    )


}

export default ContentLibrary;