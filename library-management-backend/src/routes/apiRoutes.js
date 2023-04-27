import bookController from "../controllers/bookController";
import categoryController from "../controllers/categoryController";
import statusController from "../controllers/statusController";
import handleUserController from "../controllers/handleUserController";
import studentController from "../controllers/studentController";
import historyController from "../controllers/historyController";
import groupRoleController from "../controllers/groupRoleController";
import majorController from "../controllers/majorController";
import departmentController from "../controllers/departmentController";
import otherController from "../controllers/otherController";


const handleUserRoutes = (router) => {
    router.post("/register", handleUserController.register);
    router.post("/login", handleUserController.login);
    router.post("/logout", handleUserController.logout);
    router.post("/forget", handleUserController.forget);
}

const bookRoutes = (router) => {
    router.get("/books", bookController.getBooks);
    router.post("/books", bookController.upsertBook);
    router.patch("/books", bookController.upsertBook);
    router.delete("/books", bookController.deleteABook);
}

const statusRoutes = (router) => {
    router.get("/status", statusController.getStatus);
    router.post("/status", statusController.upsertStatus);
    router.delete("/status", statusController.deleteAStatus);
    router.patch("/status", statusController.updateAStatus);
}

const categoryRoutes = (router) => {
    router.get("/categories", categoryController.getCategories);
    router.post("/categories", categoryController.upsertCategory);
    router.delete("/categories", categoryController.deleteACategory);
}

const studentRoutes = (router) => {
    router.get("/students", studentController.getStudents);
    // router.post("/students", studentController.upsertStudent);
    // router.delete("/students", studentController.deleteAStudent);
}

const historyRoutes = (router) => {
    router.get("/histories", historyController.getHistories);
    router.post("/histories", historyController.upsertHistory);
    router.patch("/histories", historyController.updateAHistory);
    router.post("/histories/uptime", historyController.updateTimeApprove);
    router.delete("/histories", historyController.deleteMultiplesHistory);
}

const groupRoleRoutes = (router) => {
    router.get("/group-roles", groupRoleController.getGroupRoles);
    router.get("/group-roles/roles", groupRoleController.getRoles);
    router.post("/group-roles", groupRoleController.upsertGroupRole);
    router.post("/group-roles/users", groupRoleController.updateGroupStudent);
    router.delete("/group-roles", groupRoleController.deleteAGroupRole);

}

const departmentRoutes = (router) => {
    router.get("/departments", departmentController.getDepartments);
    router.post("/departments", departmentController.createManyDepartments);
    router.delete("/departments", departmentController.deleteADepartment);
}

const majorRoutes = (router) => {
    router.get("/majors", majorController.getMajors);
    router.post("/majors", majorController.createManyMajors);
    router.delete("/majors", majorController.deleteAMajor);
}

const otherRoutes = (router) => {
    router.get("/tables", otherController.getAllTableNames);
}


export default {
    bookRoutes, statusRoutes, categoryRoutes, handleUserRoutes, studentRoutes, historyRoutes, groupRoleRoutes, departmentRoutes,
    majorRoutes, otherRoutes
}