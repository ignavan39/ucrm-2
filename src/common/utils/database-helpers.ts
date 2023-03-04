export const isViolatedUniqueConstraintError = (e: unknown) => {
	return (e as { routine?: string })?.routine === '_bt_check_unique';
};
