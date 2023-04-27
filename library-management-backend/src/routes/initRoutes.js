import express from 'express';
const router = express.Router();
import apiRoutes from './apiRoutes';
import jwtMiddleware from './middleware/jwtMiddleware';

const initRoutes = (app) => {
    router.all("*", jwtMiddleware.checkUserJWT, jwtMiddleware.checkUserPermission);

    apiRoutes.bookRoutes(router);
    apiRoutes.statusRoutes(router);
    apiRoutes.categoryRoutes(router);
    apiRoutes.handleUserRoutes(router);
    apiRoutes.studentRoutes(router);
    apiRoutes.historyRoutes(router);
    apiRoutes.groupRoleRoutes(router);

    apiRoutes.departmentRoutes(router);
    apiRoutes.majorRoutes(router);
    apiRoutes.otherRoutes(router);

    return app.use("/api/v1", router);
}

export default initRoutes;