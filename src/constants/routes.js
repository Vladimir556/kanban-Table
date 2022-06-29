import {Route, Routes} from 'react-router-dom'
import KanBan from '../pages/KanBan';
import Login from '../pages/Login';
import Page404 from '../pages/Page404';
export const routes = 
        <Routes>
            <Route path="kanban" element={<KanBan/>}/>
            <Route path="kanban/:id" element={<KanBan/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="*" element={<Page404/>}/>
        </Routes>
   
