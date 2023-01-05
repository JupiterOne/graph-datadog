import {
  mutations,
  Recording,
  setupRecording,
  SetupRecordingInput,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupDatadogRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    mutateEntry: mutations.unzipGzippedRecordingEntry,
    ...input,
    redactedRequestHeaders: ['dd-application-key', 'dd-api-key'],
    redactedResponseHeaders: ['content-security-policy']
  });
}
