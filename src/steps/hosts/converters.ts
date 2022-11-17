import { Host } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/Host';
import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

const SYSTEM_PROPERTIES = ['nixV', 'macV', 'winV'];

export function getHostKey(id: number): string {
  return `datadog_host:${id}`;
}

export function createHostEntity(host: Host): Entity {
  const systemProperty = SYSTEM_PROPERTIES.find(p => host.meta && host.meta[p]);
  const [osName, osVersion] = host.meta && systemProperty ? host.meta[systemProperty] : ['N/A', 'N/A'];

  return createIntegrationEntity({
    entityData: {
      source: host,
      assign: {
        _type: Entities.HOST._type,
        _class: Entities.HOST._class,
        _key: getHostKey(host.id!),
        id: `${host.id}`,
        aliases: host.aliases,
        apps: host.apps,
        awsName: host.awsName,
        hostname: host.hostName,
        isMuted: host.isMuted,
        reportedOn: parseTimePropertyValue(host.lastReportedTime),
        name: host.name,
        sources: host.sources,
        state: host.up ? 'running' : 'stopped',
        agentVersion: host.meta?.agentVersion,
        hostCpuCores: host.meta?.cpuCores,
        machine: host.meta?.machine,
        platform: host.meta?.platform,
        processor: host.meta?.processor,
        pythonVersion: host.meta?.pythonV,
        socketFqdn: host.meta?.socketFqdn,
        socketHostname: host.meta?.socketHostname,
        osName,
        osVersion
      },
    },
  });
}
