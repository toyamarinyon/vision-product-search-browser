import { fromUnixTime, format } from 'date-fns';
import { google } from '@google-cloud/vision/build/protos/protos';

export function formatIndexTime(indexTime: google.protobuf.ITimestamp | null | undefined) {
  if (indexTime == null) {
    return '-';
  }
  const seconds = indexTime.seconds?.toString();
  if (seconds == null || seconds == '0') {
    return 'no indexing';
  }
  return format(fromUnixTime(parseInt(seconds)), 'yyyy-MM-dd HH:mm:ss');
}
