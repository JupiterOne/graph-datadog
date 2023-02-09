import { Role } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/Role';
import { User as User_v2 } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/User';
import {
  Host,
  Organization,
} from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1';

export function getMockAccount(): Partial<Organization> {
  return {
    billing: {
      type: 'cc',
    },
    name: 'JupiterOne Inc.',
    publicId: '96bd2d8e-4625-11ec-a18c-da7ad0900002',
    settings: {
      privateWidgetShare: false,
      saml: {
        enabled: false,
      },
      samlAutocreateAccessRole: 'st',
      samlAutocreateUsersDomains: {
        domains: [],
        enabled: false,
      },
      samlCanBeEnabled: false,
      samlIdpInitiatedLogin: {
        enabled: false,
      },
      samlIdpMetadataUploaded: false,
      samlStrictMode: {
        enabled: false,
      },
    },
    subscription: {
      type: 'pro',
    },
  };
}

export function getMockRole(): Partial<Role> {
  return {
    attributes: {
      createdAt: new Date('2021-11-15T15:06:20.176Z'),
      modifiedAt: new Date('2021-11-15T15:06:20.176Z'),
      name: 'Datadog Standard Role',
      userCount: 0,
    },
    id: '96bd2d90-4625-11ec-a18c-da7ad0900002',
    relationships: {
      permissions: {
        data: [
          {
            id: 'c95412b9-16c7-11ec-85c0-da7ad0900002',
            type: 'permissions',
          },
          {
            id: '26c79920-1703-11ec-85d2-da7ad0900002',
            type: 'permissions',
          },
        ],
      },
    },
    type: 'roles',
  };
}

export function getMockUser(): Partial<User_v2> {
  return {
    attributes: {
      createdAt: new Date('2021-11-16T18:25:08.049Z'),
      disabled: false,
      email: 'viragsf@gmail.com',
      handle: 'viragsf@gmail.com',
      icon: 'https://secure.gravatar.com/avatar/edd1469180957cee25d7753ef4a84a13?s=48&d=retro',
      modifiedAt: new Date('2021-11-16T18:27:43.851Z'),
      serviceAccount: false,
      status: 'Active',
      verified: true,
    },
    id: '86ec37f2-470a-11ec-a204-da7ad0900002',
    relationships: {
      org: {
        data: {
          id: '96bd2d8e-4625-11ec-a18c-da7ad0900002',
          type: 'orgs',
        },
      },
      roles: {
        data: [
          {
            id: '96bd2d8f-4625-11ec-a18c-da7ad0900002',
            type: 'roles',
          },
        ],
      },
    },
    type: 'users',
  };
}

export function getMockHost(): Partial<Host> {
  return {
    aliases: ['mindfield'],
    apps: ['agent', 'container', 'docker', 'ntp'],
    hostName: 'mindfield',
    id: 9231106664,
    isMuted: false,
    lastReportedTime: 1670945215,
    meta: {
      agentVersion: '7.40.1',
      cpuCores: 1,
      fbsdV: ['', '', ''],
      gohai:
        '{"cpu":{"cache_size":"512 KB","cpu_cores":"8","cpu_logical_processors":"16","family":"23","mhz":"2200.000","model":"8","model_name":"AMD Ryzen 7 2700X Eight-Core Processor","stepping":"2","vendor_id":"AuthenticAMD"},"filesystem":[{"kb_size":"950914724","mounted_on":"/","name":"overlay"},{"kb_size":"65536","mounted_on":"/dev","name":"tmpfs"},{"kb_size":"65536","mounted_on":"/dev/shm","name":"shm"},{"kb_size":"950914724","mounted_on":"/etc/hosts","name":"/dev/nvme1n1p2"},{"kb_size":"1630628","mounted_on":"/var/run/docker.sock","name":"tmpfs"},{"kb_size":"8153124","mounted_on":"/proc/asound","name":"tmpfs"},{"kb_size":"8153124","mounted_on":"/proc/acpi","name":"tmpfs"},{"kb_size":"8153124","mounted_on":"/proc/scsi","name":"tmpfs"},{"kb_size":"8153124","mounted_on":"/sys/firmware","name":"tmpfs"}],"memory":{"swap_total":"9229308kB","total":"16306252kB"},"network":null,"platform":{"GOOARCH":"amd64","GOOS":"linux","goV":"1.18.8","hardware_platform":"x86_64","hostname":"f992d058a188","kernel_name":"Linux","kernel_release":"5.15.0-56-generic","kernel_version":"#62-Ubuntu SMP Tue Nov 22 19:54:14 UTC 2022","machine":"x86_64","os":"GNU/Linux","processor":"x86_64","pythonV":"3.8.14"}}',
      installMethod: {
        installerVersion: 'docker',
        tool: 'docker',
        toolVersion: 'docker',
      },
      macV: ['', '', ''],
      machine: 'amd64',
      nixV: ['ubuntu', '22.04', ''],
      platform: 'linux',
      processor: 'AMD Ryzen 7 2700X Eight-Core Processor',
      pythonV: '3.8.14',
      socketFqdn: 'f992d058a188',
      socketHostname: 'f992d058a188',
      winV: ['', '', ''],
    },
    metrics: {
      cpu: 6.804911,
      iowait: 0.00046491018,
      load: 0.093782894,
    },
    muteTimeout: undefined,
    name: 'mindfield',
    sources: ['agent'],
    tagsBySource: {
      Datadog: ['host:mindfield'],
    },
    up: true,
  };
}
