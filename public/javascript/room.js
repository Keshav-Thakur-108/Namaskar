const socket = io("/");
const videoGrid = document.querySelector("#video-grid");
const myVideo = document.createElement("video");
let peers = {};

const roomId = window.location.pathname.split("/")[1];
let myVideoStream;
/*
To ignore Chrome’s secure origin policy, follow these steps.
Navigate to `chrome://flags/#unsafely-treat-insecure-origin-as-secure` in Chrome.
Find and enable the `Insecure origins treated as secure` section (see below).
Add any addresses you want to ignore the secure origin policy for. Remember to include the port number too (if required).
Save and restart Chrome.
*/

const myPeer = new Peer();

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    socket.on("user-connected", (id) => {
      connectToNewUser(id, stream);
    });
  })
  .catch((err) => console.log(err));

myPeer.on("open", (id) => {
  socket.emit("join-room", id, roomId);
});

const stopPlayVideo = () => {
  const enabledVideo = myVideoStream.getVideoTracks()[0].enabled;
  if (enabledVideo) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setStopButton();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    setPlayButton();
  }
};

const setStopButton = () => {
  const html = `<i style="font-size: 1.5rem; color: #273469" class="fas fa-video-slash"></i><span>Play Video</span>`;
  const div = document.querySelector(".video_button");
  div.innerHTML = html;
};

const leaveMeeting = () => {
  socket.on("user-disconnected", (id, username) => {
    peers[id].close();
    delete peers[id];
  });
  window.location.replace("/");
};

const setPlayButton = () => {
  const html = `<i style="font-size: 1.5rem; color: #273469" class="fas fa-video"></i><span>Stop Video</span>`;
  const div = document.querySelector(".video_button");
  div.innerHTML = html;
};

const muteUnmute = () => {
  const track = myVideoStream.getAudioTracks()[0].enabled;
  if (track) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setMuteButton();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    setUnmuteButton();
  }
};

const setMuteButton = () => {
  const html = ` <i style="font-size: 1.5rem; color: #273469" class="fas fa-microphone-alt-slash"></i>
                <span style="font-size:1rem">Unmute</span>`;
  const div = document.querySelector(".mute_button");
  div.innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i style="font-size: 1.5rem; color: #273469" class="fas fa-microphone-alt"></i>
                <span style="font-size:1rem">Mute</span>`;
  const div = document.querySelector(".mute_button");
  div.innerHTML = html;
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

// const showParticipants = () => {
//   const modal = document.querySelector(".modal");
//   modal.classList.toggle("open");

//   const html = `<h2 style="color: #273469;" class="text-center">Participants</h2>
//     <ul>
//         <li>You</li>
//         ${
//           users.length > 0
//             ? users.map((name) => {
//                 console.log(name);
//                 return `<li>${name}</li>`;
//               })
//             : ""
//         }
//     </ul>`;
//   modal.innerHTML = html;
// };

const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    console.log("working");
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
};

socket.on("user-disconnected", (id, username) => {
  console.log("disconnected ", id);
  if (peers[id]) {
    peers[id].close();
    delete peers[id];
  }
});

setInterval(() => {
  console.log(peers);
}, 1000);
