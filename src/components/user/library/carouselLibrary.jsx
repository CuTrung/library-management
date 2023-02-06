import { useState, useEffect } from "react";
import CardBook from "./cardBook";
import Carousel from "react-bootstrap/Carousel";

const CarouselLibrary = ({ listBooks }) => {
    const [listCarousel, setListCarousel] = useState([]);
    // Chỉ lấy 12 books mới nhất
    const totalCarousel = Math.ceil((listBooks.length <= 12 ? listBooks.length : 12) / 4);


    useEffect(() => {
        let listData = [];
        for (let i = 0; i < totalCarousel; i++) {
            listData.push(listBooks.slice(i * 4, 4 * (i + 1)))
        }

        setListCarousel(listData);
    }, [listBooks]);


    return (
        <>
            <Carousel indicators={false} className="my-3">
                {listCarousel.length > 0 && listCarousel.map((carousel, index) => {
                    return (
                        <Carousel.Item key={`carouselItem-${index}`}>
                            <div className="row">
                                {carousel.length > 0 &&
                                    carousel.map((book, index) => {
                                        return (
                                            <CardBook
                                                key={`cardBook-${index}`}
                                                book={book}
                                                disabled={book.quantity - book.borrowed === 0}
                                            />
                                        );
                                    })}
                            </div>
                        </Carousel.Item>
                    )
                })}
            </Carousel>
        </>
    );
};

export default CarouselLibrary;
