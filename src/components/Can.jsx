/* eslint-disable react/prop-types */
import { usePermissions } from '../context/PermissionContext';

const Can = ({ page, action, children, fallback = null, showAlert = true }) => {
    const { checkPermission, performActionWithPermission } = usePermissions();

    const isAllowed = checkPermission(page, action);
    if (showAlert) {
        return (
            <div onClick={() => performActionWithPermission(
                page,
                action,
                () => { },
                null
            )}>
                {children}
            </div>
        );
    }
    return isAllowed ? <>{children}</> : <>{fallback}</>;
};

export default Can;