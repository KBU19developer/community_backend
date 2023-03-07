import PostingMain from './MainPost';
import Button from '../../../functions/BackButton';
import useAccessToken from '../../../functions/auth';

function Write(){
    useAccessToken();

    return (
        <div>
            <header>
                <h1>Write Your Posting!</h1>
                <hr />
            </header>
            <main>
                <PostingMain />
            </main>
            <footer>
                <Button path="/Board/1" name="Back" />
            </footer>
        </div>
    );
}

export default Write;