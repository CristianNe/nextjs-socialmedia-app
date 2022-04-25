import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Loader from './Loader';

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    // Creates a Firebase Upload Task
    const uploadFile = async (e) => {
        // Get the file
        const file = Array.from(e.target.files)[0] as File;
        const extension = file.type.split('/')[1];

        // Makes reference to the storage bucket location
        console.log(auth.currentUser.uid);
        
        const bucketRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
        setUploading(true);

        // Starts the upload
        const task = uploadBytesResumable(bucketRef, file);

        // Listen to updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
          const pct = Number(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0));
          setProgress(pct);

          // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
          task
              .then((d) => getDownloadURL(bucketRef))
              .then((url) => {
                setDownloadURL(url);
                setUploading(false);
              });
        });

        // Catch errors
        task.catch(error => { console.error('Server response: ', error);
        })
      };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}

      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  );
}