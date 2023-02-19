<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

- Phần mềm "Library Management" là một dự án cá nhân dùng để tham dự cuộc thi "Thiết kế thư viện" cấp trường. Phần mềm hỗ trợ sinh viên đăng kí mượn, trả sách online, tìm kiếm sách ở thư viện trường ITC. Đồng thời cũng hỗ trợ thủ thư trong việc thêm mới, chỉnh sửa, quản lí, thống kê sách, theo dõi lịch sử trả, mượn sách.

- Phần mềm là sự tích góp, tổng hợp toàn bộ các kĩ năng cá nhân, kiến thức đã học, đã tự tìm hiểu, từ đó áp dụng vào thực tiễn để hoàn thành dự án 


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

Phần mềm sử dụng các công nghệ phía Front-end cũng như Back-end để xây dựng một website. Có thể kể đến như:

* [![React][React.js]][React-url]
* [![Node][Node.js]][Node-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

-  Để cài đặt và chạy dự án trên local, hãy làm theo thứ tự các bước sau: 

### Prerequisites

Đảm bảo chắc chắn rằng bạn đã cài đặt
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

- Để chạy ứng dụng, hãy thực hiện lần lượt các bước sau

1. Clone the repo
   ```sh
   git clone https://github.com/CuTrung/library-management.git
   ```
2. Thao tác 1 trong 2 cách sau để chạy dự án:
  - Cách 1: Chạy dự án với back-end và front-end riêng biệt
    * Cài đặt back-end: 
      1. Copy toàn bộ dự án đã clone về ra một folder mới (Ngoại trừ folder .git)
      2. Tại folder mới, tải NPM packages
        ```sh
        npm install
        ```
      3. Chuyển đổi file ".env.example" => ".env", sau đó khai báo các value cần thiết trong file ".env" để có thể chạy và kết nối đến Database (Ở đây sử dụng Mysql) 
        image
      4. Trong Mysql, tạo database bạn đã khai báo trong file .env (DB_NAME=?)
        image
      5. Khởi tạo table và chèn data fake bằng câu lệnh
        ```sh
        npm run execSequelize
        ```
      6. Chạy back-end với câu lệnh
        ```sh
        npm start
        ```
    * Cài đặt front-end
      1. Quay trở lại folder cũ đã clone về ban đầu trước đó, thực hiện chuyển sang branch "front-end" với câu lệnh
        ```sh
        git checkout front-end
        ```      
      2. Tải NPM packages
        ```sh
        npm install
        ```
      3. Chuyển đổi file ".env.example" => ".env", sau đó khai báo các value cần thiết trong file ".env" để có thể chạy
        image
      4. Chạy front-end với câu lệnh 
        ```sh
        npm start
        ```
  - Trải nghiệm phần mềm tại URL ở front-end 

  - Cách 2: Chạy dự án với Docker
      1. Đảm bảo chắc chắn rằng bạn đã cài Docker (url docker)
      2. Sau khi đã clone dự án về, thực hiện chuyển sang branch "run-with-docker"
        ```sh
        git checkout run-with-docker
        ```
      3. Trong 2 folder "library-management-*", chuyển đổi file ".env.example" => ".env", sau đó khai báo các value cần thiết trong cả 2 file ".env" để có thể chạy
      4. Chạy phần mềm với docker bằng câu lệnh
        ```sh
        docker compose -p library-management up -d
        ```
  - Trải nghiệm phần mềm tại URL ở front-end (Có thể mất vài phút sau web mới chạy do quá trình setup của docker)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

Hướng dẫn sử dụng (Coming soon...)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Cù Phan Thành Trung - cuphanthanhtrung4112003@gmail.com

Project Link: [https://github.com/CuTrung/library-management](https://github.com/CuTrung/library-management)

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node-20232A?style=for-the-badge&logo=nodedotjs&logoColor=#88c24a
[Node-url]: https://nodejs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
