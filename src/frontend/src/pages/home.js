import {useUserGuard} from "util/hooks";
import UserLayout from "layout/user";


const Home = props => {
    useUserGuard()
    return (
        <UserLayout>
            <h1>Home</h1>
        </UserLayout>
    );
}

export default Home;