import NavigationBar from './NavigationBar';
import Question from './question/Question';
import Sidebar from './Sidebar';

function Home() {
    return(
        <div className="home-page">
            <NavigationBar/>
            <div className="row">
                <div className="col-4">
                    <Sidebar/>
                </div>
                <div className="col-8">
                    <Question/>
                </div>
            </div>
        </div>
    );
}

export default Home;