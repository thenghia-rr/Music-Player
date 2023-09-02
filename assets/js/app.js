//==========================FUNCTIONS==================================
// 1. Play/Pause/Seek bài hát
// 2. Prev/ Next bài hát
// 3. Tăng giảm âm lượng 
// 4. Hiển thị thời gian bắt đầu và kết thúc của mỗi bài (00.00 => 3.49)
// 5. Nút tắt âm lượng
// 6. Hoạt động trên playlist khi người dùng chọn nhạc 
// ====================================================================
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const nameMusic = $('.name-music')
const btnPlay = $('.btn-toggle-play')
const iconPlaylist = $('.icon-playlist')
const playList = $('.playlist')
const nameMusicHeader = $('.content .name-music')
const authorMusic = $('.content .author')
const imageThumb = $('.image .image-thumb')
const audio = $('#audio')
const wrapper = $('.wrapper')
const inputRange = $('.input-range')
const currentTime = $('.time-current')
const endTime = $('.time-end')
const btnNext = $('.next')
const btnPrev = $('.prev')
const btnMute = $('.mute')
const btnHeart = $('.heart')
const rangeVolume = $('.range-volume')
const toastContainer = $('.toast-container')

const app = {
    isPlaying: false ,
    isShowPlaylist: false,
    isMuted: false,
    isHeart: false,
    currentIndex: 0,
    songs : [
        {
            name: 'You Never Know',
            image: './assets/img/youNeverKnow.jpg',
            path: './assets/music/youNeverKnow.mp3',
            author: 'Blackpink'
        },
        {
            name: 'Nevada',
            image: './assets/img/nevada.jpg',
            path: './assets/music/nevada.mp3',
            author: 'Vicetone'
        }, 
        {
            name: 'Unity',
            image: './assets/img/unity.jpg',
            path: './assets/music/unity.mp3',
            author: 'Alan Walker'
        },
        {
            name: 'Lily',
            image: './assets/img/lily.jpg',
            path: './assets/music/lily.mp3',
            author: 'Nightcore'
        },
        {
            name: 'Faded',
            image: './assets/img/faded.jpg',
            path: './assets/music/faded.mp3',
            author: 'Alan Walker'
        },
        {
            name: 'Gone',
            image: './assets/img/gone.jpg',
            path: './assets/music/gone.mp3',
            author: 'Rosé'
        },
        {
            name: 'Money',
            image: './assets/img/money.jpg',
            path: './assets/music/money.mp3',
            author: 'Lalisa Manoban'
        },
        {
            name: 'Monody',
            image: './assets/img/monody.jpg',
            path: './assets/music/monody.mp3',
            author: 'Thefatrat'
        },
        {
            name: 'Trước khi em tồn tại - remix',
            image: './assets/img/TruocKhiEmTonTaiRemix.jpg',
            path: './assets/music/TruocKhiEmTonTaiRemix.mp3',
            author: 'Việt Anh'
        },
        {
            name: 'Giá Như Anh Là Người Vô Tâm ft Đáy Biển Remix',
            image: './assets/img/GiaNhuAnhLaNguoiVoTam.jpg',
            path: './assets/music/GiaNhuAnhLaNguoiVoTam.mp3',
            author: 'Mum Remix'
        },
        
        
    ],
    handleEvent() {
        _this = this
        //  Xử lí khi click nút btn-toggle-play để phát hoặc dừng nhạc
        btnPlay.onclick = function () {
            if(_this.isPlaying) {
                audio.pause()
                _this.isPlaying = false
                btnPlay.classList.remove('playing')
                imageThumbAnimate.pause()
            }else {
                audio.play()
                _this.isPlaying = true
                btnPlay.classList.add('playing')
                imageThumbAnimate.play()
            }
        }
       
        // Xử lý CD quay và dừng
        const imageThumbAnimate = imageThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        imageThumbAnimate.pause()

        // Mở playlist khi click vào icon playlist
        iconPlaylist.addEventListener('click', () => {
            if(_this.isShowPlaylist) {
                playList.classList.add('hide')
                _this.isShowPlaylist = false
            }
            else {
                playList.classList.remove('hide')
                _this.isShowPlaylist = true
            }
        })

        // Xử lí khi muốn thoát playlist và không cần phải click lại icon playlist 1 lần nữa
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
              if (!_this.isShowPlaylist) {
                // Không cần thực hiện bất kỳ hành động nào nếu playlist đã được ẩn
                return;
              }
          
              playList.classList.add('hide');
              _this.isShowPlaylist = false;
            }
        });

        // Xử lí thanh input range khi bài hát đang phát
        audio.ontimeupdate = function() {
            const inputProgressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
            inputRange.value = inputProgressPercent

            // Xử lí thời gian start => thời gian end của bài hát
            const currentTimeSecond = timeFormat(audio.currentTime)
            currentTime.textContent = currentTimeSecond
            const endTimeSecond = timeFormat(audio.duration)

            function timeFormat(seconds) {
                let minute = Math.floor(seconds / 60);
                let second = Math.floor(seconds % 60);
                minute = minute < 10 ? "0" + minute : minute;
                second = second < 10 ? "0" + second : second;
                return minute + ":" + second;
            }
            if (endTimeSecond != 'NaN:NaN') {
                endTime.textContent = endTimeSecond
            } 
        }

        // Xử lí khi tua bài hát
        inputRange.oninput = (e) => {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lí khi next bài hát
        btnNext.addEventListener('click', function (){
            _this.currentIndex++
            if(_this.currentIndex > _this.songs.length - 1) {
                _this.currentIndex = 0
            }
            _this.loadCurrentSong()
            audio.play()

            // Reset thả tim
            btnHeart.style.color = '#fff'
            _this.isHeart = false

            // Trong trường hợp không có bài hát nào đang được phát,
            // nếu click nút next thì ảnh nền và nút play/pause phải hoạt động
            if(_this.isPlaying) {
                // nothing
                return
            }
            else {
                _this.isPlaying = true
                btnPlay.classList.add('playing')
                imageThumbAnimate.play()
            }
        })
        
        // Xử lí prev bài hát
        btnPrev.addEventListener('click', function () {
            _this.currentIndex--
            if(_this.currentIndex < 0) {
                _this.currentIndex = _this.songs.length - 1
            }
            _this.loadCurrentSong()
            audio.play()

            // Reset thả tim
            btnHeart.style.color = '#fff'
            _this.isHeart = false

            // Trong trường hợp không có bài hát nào đang được phát,
            // nếu click nút next thì ảnh nền và nút play/pause phải hoạt động
            if(_this.isPlaying) {
                // nothing
                return
            }
            else {
                _this.isPlaying = true
                btnPlay.classList.add('playing')
                imageThumbAnimate.play()
            }
            
        })
        
        // Xử lí click nút mute
        btnMute.addEventListener('click', function () {
            if(_this.isMuted) {
                audio.muted = false
                btnMute.classList.remove('muted')
                _this.isMuted = false
            }
            else {
                audio.muted = true
                btnMute.classList.add('muted')
                _this.isMuted = true
            }
        })

        // Xử lí khi thả tim bài hát 
        btnHeart.addEventListener('click', () => {
            if(_this.isHeart) {
                btnHeart.style.color = '#fff'
                _this.isHeart = false
            }else {
                btnHeart.style.color = 'red'
                _this.isHeart = true

                // Xử lí hiện thông báo khi thả tim bài hát
                if(toastContainer) {

                    const toastContent = document.createElement('div')
                    toastContent.classList.add('toast-content')
                    toastContent.style.animation = `slideInLeft ease 0.3s, fadeOut linear 1s 2s forwards`
            
                    toastContent.innerHTML = `
                            <strong>
                                <h1>Success!</h1>
                                <span class="icon-close">
                                    <i class="fa-solid fa-xmark"></i>
                                </span>
                            </strong>
                            <p>Đã thêm bài hát <span>${_this.currentSong.name} </span> vào danh sách yêu thích</p>
                    `
                    toastContainer.appendChild(toastContent)

                    // Tự động gỡ toast message ra khỏi DOM sau khi thời gian kết thúc
                    const autoRemoveToast = setTimeout(() =>{
                        toastContainer.removeChild(toastContent)
                    }, 3000)

                    // Xử lí khi click icon close => toast message sẽ gỡ khỏi DOM
                    const iconClose = $('.icon-close i')
                    
                    iconClose.onclick = (e) => {
                        if(e.target.closest('.icon-close i')) {
                            toastContainer.removeChild(toastContent)
                            clearTimeout(autoRemoveToast)
                        }
                    }
                }
            }
   
        })

        // Xử lí tăng giảm âm lượng khi trượt thanh range volumn
        rangeVolume.oninput = (e) => {
            const currentVolume = e.target.value / 100

            audio.volume = currentVolume
        }  

        // Xử lí tự next qua bài mới khi bài hát kết thúc
        audio.onended = function () {
            btnNext.click()
        }
        
        // Xử lí khi click vào Playlist
        playList.addEventListener('click', (e) => {
            // Kiểm tra bài hát nào đang không active và ngoại trừ nút option mới xử lí
            const songsNotActive = e.target.closest('.playlist__content:not(.active)')
            
            if(songsNotActive || e.target.closest('.option')) {
                
                // Xử lí khi click vô bài hát 
                if(songsNotActive) {
                    // Tips: Dùng dataset.indexx thay vì dùng getAttribute()
                    //Dùng + or Number để convert index từ string => number
                    _this.currentIndex =  +(songsNotActive.dataset.index) 
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()

                    // Reset thả tim
                    btnHeart.style.color = '#fff'
                    _this.isHeart = false

                    // Trong trường hợp không có bài hát nào đang được phát,
                    // nếu click nút next thì ảnh nền và nút play/pause phải hoạt động
                    if(_this.isPlaying) {
                        // nothing
                        return
                    }
                    else {
                        _this.isPlaying = true
                        btnPlay.classList.add('playing')
                        imageThumbAnimate.play()
                    }
                }

                // Xử lí khi click vô option
                if(e.target.closest('.option')) {
                    alert('OPPS! Tính năng đang phát triển ...')
                }
            }
            
        })
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="playlist__content ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="image" 
                        style="background-image: url('${song.image}');">
                    </div>

                    <div class="info">
                        <h3 class="name">${song.name}</h3>
                        <p class="author">${song.author}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    loadCurrentSong() {
        nameMusicHeader.innerText = this.currentSong.name
        authorMusic.innerText = this.currentSong.author
        imageThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    start() {
        // Định nghĩa lại các thuộc tính để tối ưu hơn
        this.defineProperties()

        // Xử lí sự kiện (click, onchange, mouse ...)
        this.handleEvent()
        
        // Phát bài hát hiện tại
        this.loadCurrentSong();

        // Hiển thị Playlist
        this.render()
    }
}

app.start()
