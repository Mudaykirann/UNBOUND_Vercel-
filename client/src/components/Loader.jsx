import loadingigf from '../assets/ZKZg.gif'

const Loader = () => {
    return (
        <div className='loader'>
            <div className='loader__image'>
                <img width="100" src={loadingigf} alt='loading gif' />
            </div>
        </div>
    )
}

export default Loader
