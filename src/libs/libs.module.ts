import { Global, Module } from '@nestjs/common';
import { AwsModule } from './aws/aws.module';
import { CaslModule } from './casl/casl.module';
import { GcpModule } from './gcp/gcp.module';
import { MonitoringModule } from './nestlens/monitoring.module';

@Global()
@Module({
  imports: [AwsModule, GcpModule, CaslModule, MonitoringModule],
  exports: [CaslModule, MonitoringModule],
})
export class LibsModule {}
