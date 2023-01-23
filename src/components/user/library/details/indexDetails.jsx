import TopListBooks from './topListBooks';
import BookDetails from './bookDetails';

const IndexDetails = (props) => {

    return (
        <>
            <div className="row mt-3">
                <div className="col-8">
                    <BookDetails />
                </div>
                <div className="col-4">
                    <TopListBooks />
                </div>
            </div>
        </>
    )
}

export default IndexDetails;