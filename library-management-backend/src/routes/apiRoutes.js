import bookController from "../controllers/bookController";
import categoryController from "../controllers/categoryController";
import statusController from "../controllers/statusController";
import handleUserController from "../controllers/handleUserController";
import studentController from "../controllers/studentController";
import historyController from "../controllers/historyController";
import groupRoleController from "../controllers/groupRoleController";
import majorController from "../controllers/majorController";
import departmentController from "../controllers/departmentController";


const handleUserRoutes = (router) => {
    router.post("/api/register", handleUserController.register);
    router.post("/api/login", handleUserController.login);
    router.post("/api/logout", handleUserController.logout);
    router.post("/api/forget", handleUserController.forget);
}

const bookRoutes = (router) => {
    router.get("/api/books", bookController.getBooks);
    router.get("/api/books/filter", bookController.filterBooksBy);
    router.post("/api/books", bookController.upsertBook);
    router.delete("/api/books", bookController.deleteABook);
    router.post("/api/books/lost", bookController.updateABook);
}

const statusRoutes = (router) => {
    router.get("/api/status", statusController.getStatus);
    // router.post("/api/status", statusController.createANewStatus);
    // router.delete("/api/status", statusController.deleteAStatus);
    // router.patch("/api/status", statusController.updateAStatus);
}

const categoryRoutes = (router) => {
    router.get("/api/categories", categoryController.getCategories);
    router.post("/api/categories", categoryController.upsertCategory);
    router.delete("/api/categories", categoryController.deleteACategory);
}

const studentRoutes = (router) => {
    // router.get("/api/students", studentController.getStudents);
    // router.post("/api/students", studentController.upsertStudent);
    // router.delete("/api/students", studentController.deleteAStudent);
}

const historyRoutes = (router) => {
    router.get("/api/histories", historyController.getHistories);
    router.post("/api/histories", historyController.upsertHistory);
    router.post("/api/histories/uptime", historyController.updateTimeApprove);
    router.delete("/api/histories", historyController.deleteMultiplesHistory);
}

const groupRoleRoutes = (router) => {
    router.get("/api/groupRoles", groupRoleController.getGroupRoles);
    router.get("/api/groupRoles/roles", groupRoleController.getRoles);
    router.post("/api/groupRoles", groupRoleController.upsertGroupRole);
    router.delete("/api/groupRoles", groupRoleController.deleteAGroupRole);
}

const departmentRoutes = (router) => {
    router.get("/api/departments", departmentController.getDepartments);
    router.post("/api/departments", departmentController.createManyDepartments);
    router.delete("/api/departments", departmentController.deleteADepartment);
}

const majorRoutes = (router) => {
    router.get("/api/majors", majorController.getMajors);
    router.post("/api/majors", majorController.createManyMajors);
    router.delete("/api/majors", majorController.deleteAMajor);
}


export default {
    bookRoutes, statusRoutes, categoryRoutes, handleUserRoutes, studentRoutes, historyRoutes, groupRoleRoutes, departmentRoutes,
    majorRoutes,
}