import CardBook from "./cardBook";
import Carousel from "react-bootstrap/Carousel";

const CarouselLibrary = ({ listBooks }) => {


    return (
        <>
            <Carousel indicators={false} className="my-3">
                <Carousel.Item>
                    <div className="row">
                        {listBooks.length > 0 &&
                            listBooks.slice(0, 4).map((book, index) => {
                                return (
                                    <CardBook
                                        key={`cardBook-${index}`}
                                        book={book}
                                        imgName={"quiz3.jpg"}
                                    />
                                );
                            })}
                    </div>
                </Carousel.Item>
            </Carousel>
        </>
    );
};

export default CarouselLibrary;
