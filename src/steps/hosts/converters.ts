import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getHostKey(id: number): string {
  return `datadog_host:${id}`;
}

// https://docs.datadoghq.com/api/latest/hosts/

/**
 * Creates host entity
 * Does NOT use the Host.d.ts model because of a bug in the package.
 * node-fetch is used to get this data.
 * @param host
 */
export function createHostEntity(host): Entity {
  const osVersion = determineOsVersion({
    macV: host.meta?.macV,
    winV: host.meta?.winV,
    nixV: host.meta?.nixV,
  });

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
        awsName: host.aws_name,
        hostname: host.host_name,
        isMuted: host.is_muted,
        reportedOn: parseTimePropertyValue(host.last_reported_time),
        name: host.name,
        sources: host.sources,
        state: host.up ? 'running' : 'stopped',
        agentVersion: host.meta?.agent_version,
        hostCpuCores: host.meta?.cpuCores,
        machine: host.meta?.machine,
        platform: host.meta?.platform,
        processor: host.meta?.processor,
        pythonVersion: host.meta?.pythonV,
        socketFqdn: host.meta?.['socket-fqdn'],
        socketHostname: host.meta?.['socket-hostname'],
        osName: host.meta?.platform,
        osVersion,
      },
    },
  });
}

/**
 * Determines the OS Version details
 * Example data:
 *  [ '13.1', [ '', '', '' ], 'amd64' ]
 *  [ 'ubuntu', '22.04', '' ]
 * @param macV
 * @param winV
 * @param nixV
 */
export function determineOsVersion({ macV, winV, nixV }) {
  if (Array.isArray(macV) && macV.filter((prop) => prop).length > 0) {
    return reduceOsVersion(macV);
  } else if (Array.isArray(winV) && winV.filter((prop) => prop).length > 0) {
    return reduceOsVersion(winV);
  } else if (Array.isArray(nixV) && nixV.filter((prop) => prop).length > 0) {
    return reduceOsVersion(nixV);
  }
}

/**
 * Produces a single string that includes all provided data.
 * @param version
 */
function reduceOsVersion(version) {
  return version
    .filter((prop) => prop)
    .map((prop) => {
      if (Array.isArray(prop)) {
        return prop.filter((prop) => prop).join(' ');
      } else {
        return prop;
      }
    })
    .filter((prop) => prop)
    .join(' ');
}
