import ReactLoading from 'react-loading';

function LoadingSpinner() {
    return (
        <div className='tab-content loading'>
            <ReactLoading type='spin' height={250} width={250} color='#006633'/>
        </div>);
}

export default LoadingSpinner;
