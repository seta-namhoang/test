import React from 'react';
import baseApi from '../api/baseApi';
import _ from 'lodash';

export function useUpload(file, token, url) {
  const [uploading, setUploading] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [success, setSuccess] = React.useState(false);
  const [data, setData] = React.useState(null);
  const resetUpload = () => {
    setUploaded(false);
    setUploading(false);
    setProgress(0);
    setSuccess(false);
  };
  React.useEffect(() => {
    if (file) {
      resetUpload();
      var data = new FormData();
      data.append('file', file);
      var config = {
        onUploadProgress: progressEvent => {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      };
      baseApi(token)
        .post(url, data, config)
        .then(res => {
          const data = _.get(res, 'data.data', {});
          console.log(data);
          setSuccess(true);
          setUploaded(true);
          setUploading(false);
          setData(data);
        })
        .catch(err => {
          setUploaded(true);
          setSuccess(false);
          setUploading(false);
        });
    } else {
      resetUpload();
    }
  }, [file]);
  return [uploading, uploaded, progress, success, data];
}
