import { useState, useEffect, useRef } from 'react';

class WebRTCManager {
  constructor(socket, roomId, isHost = false) {
    this.socket = socket;
    this.roomId = roomId;
    this.isHost = isHost;
    this.localStream = null;
    this.screenStream = null;
    this.peerConnections = new Map();
    this.localVideo = null;
    this.remoteVideos = new Map();
    this.isScreenSharing = false;
    
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on('webrtc-offer', this.handleOffer.bind(this));
    this.socket.on('webrtc-answer', this.handleAnswer.bind(this));
    this.socket.on('webrtc-ice-candidate', this.handleIceCandidate.bind(this));
    this.socket.on('user-joined-webrtc', this.handleUserJoined.bind(this));
    this.socket.on('user-left-webrtc', this.handleUserLeft.bind(this));
    this.socket.on('screen-share-started', this.handleScreenShareStarted.bind(this));
    this.socket.on('screen-share-stopped', this.handleScreenShareStopped.bind(this));
  }

  async initializeMedia(videoElement) {
    try {
      this.localVideo = videoElement;
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (this.localVideo) {
        this.localVideo.srcObject = this.localStream;
      }
      
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async createPeerConnection(userId) {
    const peerConnection = new RTCPeerConnection(this.configuration);
    
    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream);
      });
    }
    
    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      this.handleRemoteStream(userId, remoteStream);
    };
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('webrtc-ice-candidate', {
          roomId: this.roomId,
          candidate: event.candidate,
          targetUserId: userId
        });
      }
    };
    
    this.peerConnections.set(userId, peerConnection);
    return peerConnection;
  }

  async handleUserJoined(data) {
    const { userId } = data;
    if (this.isHost) {
      await this.createOffer(userId);
    }
  }

  async createOffer(userId) {
    const peerConnection = await this.createPeerConnection(userId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    this.socket.emit('webrtc-offer', {
      roomId: this.roomId,
      offer,
      targetUserId: userId
    });
  }

  async handleOffer(data) {
    const { offer, fromUserId } = data;
    const peerConnection = await this.createPeerConnection(fromUserId);
    
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    this.socket.emit('webrtc-answer', {
      roomId: this.roomId,
      answer,
      targetUserId: fromUserId
    });
  }

  async handleAnswer(data) {
    const { answer, fromUserId } = data;
    const peerConnection = this.peerConnections.get(fromUserId);
    
    if (peerConnection) {
      await peerConnection.setRemoteDescription(answer);
    }
  }

  async handleIceCandidate(data) {
    const { candidate, fromUserId } = data;
    const peerConnection = this.peerConnections.get(fromUserId);
    
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate);
    }
  }

  handleUserLeft(data) {
    const { userId } = data;
    const peerConnection = this.peerConnections.get(userId);
    
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(userId);
    }
    
    this.remoteVideos.delete(userId);
  }

  handleRemoteStream(userId, stream) {
    this.remoteVideos.set(userId, stream);
    // Emit event to update UI
    if (this.onRemoteStream) {
      this.onRemoteStream(userId, stream);
    }
  }

  async startScreenShare() {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Replace video track in all peer connections
      const videoTrack = this.screenStream.getVideoTracks()[0];
      
      this.peerConnections.forEach(async (peerConnection) => {
        const sender = peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      });
      
      // Update local video
      if (this.localVideo) {
        this.localVideo.srcObject = this.screenStream;
      }
      
      this.isScreenSharing = true;
      
      // Handle screen share end
      videoTrack.onended = () => {
        this.stopScreenShare();
      };
      
      // Notify other users
      this.socket.emit('screen-share-started', {
        roomId: this.roomId,
        userId: this.socket.id
      });
      
      return true;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return false;
    }
  }

  async stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
    
    // Replace with camera stream
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      
      this.peerConnections.forEach(async (peerConnection) => {
        const sender = peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      });
      
      if (this.localVideo) {
        this.localVideo.srcObject = this.localStream;
      }
    }
    
    this.isScreenSharing = false;
    
    this.socket.emit('screen-share-stopped', {
      roomId: this.roomId,
      userId: this.socket.id
    });
  }

  handleScreenShareStarted(data) {
    // Handle when someone else starts screen sharing
    if (this.onScreenShareStarted) {
      this.onScreenShareStarted(data);
    }
  }

  handleScreenShareStopped(data) {
    // Handle when someone else stops screen sharing
    if (this.onScreenShareStopped) {
      this.onScreenShareStopped(data);
    }
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  cleanup() {
    // Stop all streams
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    this.peerConnections.forEach(peerConnection => {
      peerConnection.close();
    });
    this.peerConnections.clear();
    
    // Clear remote videos
    this.remoteVideos.clear();
  }
}

export default WebRTCManager;