import TopListBooks from './topListBooks';
import BookDetails from './bookDetails';

const IndexDetails = (props) => {

    return (
        <>
            <div className="row mt-3">
                <div className="col-md-8 col-12">
                    <BookDetails />
                </div>
                <div className="col-md-4 mt-3">
                    <TopListBooks />
                </div>
            </div>
        </>
    )
}

export default IndexDetails;